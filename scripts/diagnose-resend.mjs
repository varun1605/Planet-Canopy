import { Resend } from 'resend'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

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

const key = process.env.RESEND_API_KEY
const owner = process.env.OWNER_EMAIL
const from = process.env.RESEND_FROM_EMAIL || 'Planet Canopy <onboarding@resend.dev>'

console.log('Owner email :', owner || '(not set)')
console.log('From address:', from)
console.log(
  'API key     :',
  key ? key.slice(0, 5) + '...' + key.slice(-4) + ` (length ${key.length})` : '(not set)',
)

if (!key) {
  console.error('\n❌ RESEND_API_KEY is missing from .env.local')
  process.exit(1)
}
if (!key.startsWith('re_')) {
  console.error('\n❌ RESEND_API_KEY does not start with "re_" — looks invalid')
  console.error('   You may still have the placeholder text in .env.local')
  process.exit(1)
}
if (!owner) {
  console.error('\n❌ OWNER_EMAIL is missing from .env.local')
  process.exit(1)
}

const resend = new Resend(key)

try {
  const { data, error } = await resend.emails.send({
    from,
    to: owner,
    subject: 'Resend diagnostic ping',
    html: '<p>If you see this, sending works.</p>',
  })

  if (error) {
    console.error('\n❌ Resend rejected the send:')
    console.error('  name    :', error.name)
    console.error('  message :', error.message)
    if (error.statusCode) console.error('  status  :', error.statusCode)
    process.exit(1)
  }

  console.log('\n✅ Resend accepted the send. ID:', data?.id)
  console.log('   Check the Resend dashboard → Emails for delivery status.')
  console.log('   Then check', owner, '(spam folder too).')
} catch (err) {
  console.error('\n❌ Network/library error:')
  console.error(' ', err.message)
}
