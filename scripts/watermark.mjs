/**
 * Build two versions of each gallery photo:
 *
 *   /public/<name>          — clean thumbnail (≤ THUMB_WIDTH px wide)
 *                             served in the gallery grid; no watermark.
 *   /public/full/<name>     — watermarked preview (≤ FULL_WIDTH px wide)
 *                             served in the lightbox; tiled diagonal watermark
 *                             covers the entire image so it cannot be cropped out.
 *
 * Reads from /public/_originals/ which is created (and gitignored) on the
 * first run — pristine masters live there, watermarked outputs are derived.
 *
 * Run:
 *   node scripts/watermark.mjs
 */

import sharp from 'sharp'
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
} from 'node:fs'
import { resolve, basename } from 'node:path'
import { pathToFileURL } from 'node:url'

// ── Tunable knobs ─────────────────────────────────────────────────────────
const WATERMARK_TEXT = '© Planet Canopy'
const WATERMARK_OPACITY = 0.35   // tiled = use lower opacity to stay tasteful
const WATERMARK_ROTATION = -30   // degrees; diagonal feels more editorial
const FONT_FAMILY = 'Georgia, "Cormorant Garamond", serif'

const THUMB_WIDTH = 800          // /public/<name>            — gallery grid
const FULL_WIDTH = 1600          // /public/full/<name>       — lightbox
const THUMB_QUALITY = 80
const FULL_QUALITY = 86
// ──────────────────────────────────────────────────────────────────────────

const PUBLIC_DIR = resolve(process.cwd(), 'public')
const ORIGINALS_DIR = resolve(PUBLIC_DIR, '_originals')
const FULL_DIR = resolve(PUBLIC_DIR, 'full')

// Source list — the gallery component reads from the same file.
const galleryModule = await import(
  pathToFileURL(resolve(process.cwd(), 'lib/gallery-images.ts')).href
).catch(() => {
  console.log('  (could not import lib/gallery-images.ts directly — globbing /public)')
  const all = readdirSync(PUBLIC_DIR)
    .filter((f) => /\.(jpe?g)$/i.test(f))
    .filter((f) => !/^(Hero|marquee[0-9]?|placeholder)/i.test(f))
    .map((f) => '/' + f)
  return { WILDLIFE_PHOTOS: all }
})
const photos = galleryModule.WILDLIFE_PHOTOS

if (!existsSync(ORIGINALS_DIR)) mkdirSync(ORIGINALS_DIR, { recursive: true })
if (!existsSync(FULL_DIR)) mkdirSync(FULL_DIR, { recursive: true })

function buildTiledSvg(width, height) {
  // Font scales with image width so the watermark looks the same relative size
  // on a 540 px source and a 1600 px source.
  const fontSize = Math.max(22, Math.round(width / 36))
  const stepX = Math.round(fontSize * 13)
  const stepY = Math.round(fontSize * 4.5)
  // Add overflow margin so rotated text still covers all four corners.
  const overflow = Math.max(width, height)
  const texts = []
  for (let y = -overflow; y < height + overflow; y += stepY) {
    // Stagger every other row by half-step for a more organic tile pattern.
    const rowOffset = Math.round(((y / stepY) % 2) * (stepX / 2))
    for (let x = -overflow + rowOffset; x < width + overflow; x += stepX) {
      texts.push(
        `<text x="${x}" y="${y}" font-family='${FONT_FAMILY}' font-size="${fontSize}" ` +
          `font-weight="500" fill="white" fill-opacity="${WATERMARK_OPACITY}" ` +
          `letter-spacing="${Math.round(fontSize / 12)}" ` +
          `transform="rotate(${WATERMARK_ROTATION} ${x} ${y})">${WATERMARK_TEXT}</text>`,
      )
    }
  }
  return Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">` +
      // Subtle drop shadow underneath each tile for legibility on bright photos.
      `<defs>
        <filter id="s" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.5"
                        flood-color="#000" flood-opacity="0.55"/>
        </filter>
      </defs>` +
      `<g filter="url(#s)">${texts.join('')}</g>` +
      `</svg>`,
  )
}

async function processOne(publicPath) {
  const filename = basename(publicPath)
  const originalPath = resolve(ORIGINALS_DIR, filename)
  const livePath = resolve(PUBLIC_DIR, filename)
  const fullPath = resolve(FULL_DIR, filename)

  // First time: back up the pristine version untouched.
  if (!existsSync(originalPath)) {
    if (!existsSync(livePath)) {
      console.warn(`\n  ⚠ skipping (file not found): ${filename}`)
      return { skipped: true }
    }
    copyFileSync(livePath, originalPath)
  }

  // Decode once, honour EXIF rotation, then branch into two outputs.
  const baseBuf = await sharp(originalPath, { failOn: 'none' }).rotate().toBuffer()

  // Output 1: clean thumbnail
  await sharp(baseBuf)
    .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: THUMB_QUALITY, mozjpeg: true })
    .toFile(livePath + '.tmp')

  // Output 2: watermarked full
  const fullSrc = await sharp(baseBuf)
    .resize({ width: FULL_WIDTH, withoutEnlargement: true })
    .toBuffer()
  const fullMeta = await sharp(fullSrc).metadata()
  const svg = buildTiledSvg(fullMeta.width, fullMeta.height)
  await sharp(fullSrc)
    .composite([{ input: svg, top: 0, left: 0 }])
    .jpeg({ quality: FULL_QUALITY, mozjpeg: true })
    .toFile(fullPath + '.tmp')

  const { renameSync } = await import('node:fs')
  renameSync(livePath + '.tmp', livePath)
  renameSync(fullPath + '.tmp', fullPath)

  return { width: fullMeta.width, height: fullMeta.height }
}

console.log(`Building ${photos.length} photos × 2 (thumb + watermarked full)…`)
console.log(`  watermark : "${WATERMARK_TEXT}"  opacity ${WATERMARK_OPACITY}  rotation ${WATERMARK_ROTATION}°`)
console.log(`  thumb     : ≤ ${THUMB_WIDTH}px wide, no watermark`)
console.log(`  full      : ≤ ${FULL_WIDTH}px wide, tiled watermark`)
console.log('')

let done = 0
const start = Date.now()
for (const p of photos) {
  try {
    const r = await processOne(p)
    if (!r.skipped) done++
    process.stdout.write(`\r  [${done}/${photos.length}] ${basename(p)}                  `)
  } catch (err) {
    console.error(`\n  ❌ ${basename(p)}: ${err.message}`)
  }
}

const elapsed = ((Date.now() - start) / 1000).toFixed(1)
console.log(`\n\n✅ Done in ${elapsed}s. ${done} photos built (thumb + full).`)
console.log('   Originals (pristine):  /public/_originals  (gitignored)')
console.log('   Gallery thumbnails:    /public/<name>       (clean)')
console.log('   Lightbox previews:     /public/full/<name>  (watermarked)')
