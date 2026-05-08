/**
 * One-time migration: upload all photos from /public/_originals to Sanity
 * and create a galleryPhoto document for each.
 *
 * Idempotent — re-running won't duplicate. It checks Sanity for an existing
 * galleryPhoto whose image's original filename matches before uploading.
 *
 * Run:
 *   node scripts/migrate-gallery-to-sanity.mjs
 *
 * Requires: SANITY_API_TOKEN with Editor permissions in .env.local
 */

import { createClient } from '@sanity/client'
import {
  readdirSync,
  readFileSync,
  existsSync,
} from 'node:fs'
import { resolve, basename, extname } from 'node:path'

function loadEnv() {
  const txt = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8')
  for (const raw of txt.split('\n')) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue
    const eq = line.indexOf('=')
    if (eq < 0) continue
    const k = line.slice(0, eq).trim()
    const v = line.slice(eq + 1).trim()
    if (!process.env[k]) process.env[k] = v
  }
}
loadEnv()

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!token) {
  console.error('❌ SANITY_API_TOKEN missing — needs Editor permission')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-01-01',
  useCdn: false,
  token,
})

const ORIGINALS_DIR = resolve(process.cwd(), 'public/_originals')

if (!existsSync(ORIGINALS_DIR)) {
  console.error(`❌ ${ORIGINALS_DIR} not found.`)
  console.error('   Run scripts/watermark.mjs first to back up originals.')
  process.exit(1)
}

const files = readdirSync(ORIGINALS_DIR)
  .filter((f) => /\.(jpe?g)$/i.test(f))
  .sort()

console.log(`Found ${files.length} originals to migrate.`)

// Pull existing galleryPhotos so we can skip already-uploaded ones.
console.log('Fetching existing galleryPhoto documents to dedupe…')
const existing = await client.fetch(
  `*[_type == "galleryPhoto"]{ _id, "filename": image.asset->originalFilename }`,
)
const existingFilenames = new Set(
  existing.map((d) => d.filename).filter(Boolean),
)
console.log(`  ${existing.length} galleryPhoto documents already exist (${existingFilenames.size} have filenames).`)

let uploaded = 0
let skipped = 0
let failed = 0
const start = Date.now()

for (let i = 0; i < files.length; i++) {
  const filename = files[i]
  const filePath = resolve(ORIGINALS_DIR, filename)
  const label = `[${i + 1}/${files.length}] ${filename}`

  if (existingFilenames.has(filename)) {
    console.log(`${label} — already in Sanity, skipping`)
    skipped++
    continue
  }

  try {
    process.stdout.write(`${label} — uploading… `)
    const buffer = readFileSync(filePath)
    const asset = await client.assets.upload('image', buffer, {
      filename,
      contentType: 'image/jpeg',
    })
    process.stdout.write('document… ')
    await client.create({
      _type: 'galleryPhoto',
      image: {
        _type: 'image',
        asset: { _type: 'reference', _ref: asset._id },
      },
      order: 100 + i, // initial sort matches alphabetic order; client can reorder later
    })
    process.stdout.write('✓\n')
    uploaded++
  } catch (err) {
    process.stdout.write(`❌ ${err.message}\n`)
    failed++
  }
}

const elapsed = ((Date.now() - start) / 1000).toFixed(1)
console.log(`\nDone in ${elapsed}s.`)
console.log(`  Uploaded: ${uploaded}`)
console.log(`  Skipped (already there): ${skipped}`)
if (failed) console.log(`  Failed: ${failed}`)
console.log('\nOpen Sanity Studio → Gallery Photo to see the migrated documents.')
