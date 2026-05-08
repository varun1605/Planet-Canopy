import { createClient } from '@sanity/client'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// Tiny .env.local loader (so we don't need a dotenv dep)
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
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_TOKEN

console.log('Project ID:', projectId)
console.log('Dataset:   ', dataset)
console.log('Token:     ', token ? token.slice(0, 6) + '...' + token.slice(-4) + ` (length ${token.length})` : '(not set)')

if (!token) {
  console.error('\n❌ SANITY_API_TOKEN is missing from .env.local')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-01-01',
  useCdn: false,
  token,
})

try {
  const doc = await client.create({
    _type: 'enquiry',
    name: 'Diagnostic Ping',
    email: 'diagnose@example.com',
    phone: '+0',
    park: '',
    date: '',
    guests: '',
    message: 'Created by scripts/diagnose-sanity.mjs',
    submittedAt: new Date().toISOString(),
    status: 'new',
  })
  console.log('\n✅ Sanity write succeeded. Document ID:', doc._id)
  console.log('   Open Studio → Enquiry to see it. You can delete it from there.')
} catch (err) {
  console.error('\n❌ Sanity write failed:')
  console.error('  message :', err.message)
  console.error('  status  :', err.statusCode)
  console.error('  details :', err.details || err.response?.body || '(none)')
}
