import { NextResponse } from "next/server"
import sharp from "sharp"
import { sanityClient } from "@/lib/sanity"

export const runtime = "nodejs"
// Cache the rendered image for a year on the edge — Sanity asset IDs are
// content-addressable, so the bytes never change for a given (id,size) pair.
export const revalidate = 31536000

const SIZES = {
  thumb: { width: 800, watermark: false, quality: 80 },
  full: { width: 1600, watermark: true, quality: 86 },
} as const

type SizeKey = keyof typeof SIZES

const WATERMARK_TEXT = "© Planet Canopy"
const WATERMARK_OPACITY = 0.35
const WATERMARK_ROTATION = -30

function buildTiledWatermark(width: number, height: number): Buffer {
  // Vercel's serverless image (librsvg) has limited SVG support — no
  // feDropShadow, no custom font lookups. We use only:
  //   - generic font-family "sans-serif"
  //   - stroke as a faux-shadow for legibility on bright/dark photos
  // and skip filters entirely.
  const fontSize = Math.max(22, Math.round(width / 36))
  const stepX = Math.round(fontSize * 13)
  const stepY = Math.round(fontSize * 4.5)
  const overflow = Math.max(width, height)
  const strokeWidth = Math.max(1, Math.round(fontSize / 18))
  const texts: string[] = []
  for (let y = -overflow; y < height + overflow; y += stepY) {
    const rowOffset = Math.round(((y / stepY) % 2) * (stepX / 2))
    for (let x = -overflow + rowOffset; x < width + overflow; x += stepX) {
      texts.push(
        `<text x="${x}" y="${y}" font-family="sans-serif" ` +
          `font-size="${fontSize}" font-weight="600" ` +
          `fill="white" fill-opacity="${WATERMARK_OPACITY}" ` +
          `stroke="black" stroke-opacity="0.45" stroke-width="${strokeWidth}" ` +
          `paint-order="stroke fill" ` +
          `letter-spacing="${Math.round(fontSize / 12)}" ` +
          `transform="rotate(${WATERMARK_ROTATION} ${x} ${y})">${WATERMARK_TEXT}</text>`,
      )
    }
  }
  return Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">` +
      texts.join("") +
      `</svg>`,
  )
}

// Sanity asset IDs look like `image-abc123def456-3024x4032-jpg`.
// Validate to prevent any path-traversal / injection attempts.
function isValidAssetId(id: string): boolean {
  return /^image-[a-f0-9]{20,}-\d+x\d+-(jpe?g|png|webp)$/i.test(id)
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string; size: string }> },
) {
  const { id, size } = await ctx.params

  if (!(size in SIZES)) {
    return new NextResponse("Invalid size", { status: 400 })
  }
  if (!isValidAssetId(id)) {
    return new NextResponse("Invalid asset id", { status: 400 })
  }

  const config = SIZES[size as SizeKey]

  // Fetch the asset record from Sanity to get its CDN URL.
  let assetUrl: string | undefined
  try {
    const asset = await sanityClient.getDocument(id)
    assetUrl = asset?.url as string | undefined
  } catch {
    return new NextResponse("Asset lookup failed", { status: 502 })
  }

  if (!assetUrl) {
    return new NextResponse("Asset not found", { status: 404 })
  }

  // Download the original from Sanity's CDN.
  let originalBuffer: Buffer
  try {
    const r = await fetch(assetUrl)
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    originalBuffer = Buffer.from(await r.arrayBuffer())
  } catch (err) {
    return new NextResponse(`Asset fetch failed: ${(err as Error).message}`, {
      status: 502,
    })
  }

  // Process: resize, optionally watermark, encode.
  try {
    let pipeline = sharp(originalBuffer, { failOn: "none" })
      .rotate()
      .resize({ width: config.width, withoutEnlargement: true })

    if (config.watermark) {
      const buf = await pipeline.toBuffer()
      const meta = await sharp(buf).metadata()
      const svg = buildTiledWatermark(meta.width ?? config.width, meta.height ?? config.width)
      pipeline = sharp(buf).composite([{ input: svg, top: 0, left: 0 }])
    }

    const out = await pipeline
      .jpeg({ quality: config.quality, mozjpeg: true })
      .toBuffer()

    return new NextResponse(out, {
      headers: {
        "Content-Type": "image/jpeg",
        // 1 year, immutable — content for a given (id,size) never changes.
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Image-Source": "planet-canopy",
      },
    })
  } catch (err) {
    return new NextResponse(`Render failed: ${(err as Error).message}`, {
      status: 500,
    })
  }
}
