import { NextResponse } from "next/server"
import { Resend } from "resend"
import { z } from "zod"
import { sanityWriteClient } from "@/lib/sanity"

export const runtime = "nodejs"

const EnquirySchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(5).max(40),
  park: z.string().trim().max(120).optional().default(""),
  date: z.string().trim().max(40).optional().default(""),
  guests: z.string().trim().max(20).optional().default(""),
  message: z.string().trim().max(2000).optional().default(""),
})

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

export async function POST(req: Request) {
  let payload: unknown
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = EnquirySchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const data = parsed.data
  const submittedAt = new Date().toISOString()

  // 1. Persist to Sanity (the log)
  try {
    await sanityWriteClient.create({
      _type: "enquiry",
      ...data,
      submittedAt,
      status: "new",
    })
  } catch (err) {
    console.error("[enquiry] Sanity write failed", err)
    return NextResponse.json(
      { error: "Could not save enquiry. Please try again." },
      { status: 502 },
    )
  }

  // 2. Notify the owner via email (best-effort — log failure but don't 500
  //    the user since the enquiry was already saved).
  const resendKey = process.env.RESEND_API_KEY
  const ownerEmail = process.env.OWNER_EMAIL
  const fromEmail = process.env.RESEND_FROM_EMAIL || "Planet Canopy <onboarding@resend.dev>"

  if (resendKey && ownerEmail) {
    try {
      const resend = new Resend(resendKey)
      const subject = `New enquiry from ${data.name}${data.park ? ` — ${data.park}` : ""}`
      const html = `
        <h2 style="font-family:system-ui,sans-serif">New safari enquiry</h2>
        <table style="font-family:system-ui,sans-serif;border-collapse:collapse;font-size:14px">
          <tr><td style="padding:6px 12px;color:#666">Name</td><td style="padding:6px 12px"><strong>${escapeHtml(data.name)}</strong></td></tr>
          <tr><td style="padding:6px 12px;color:#666">Email</td><td style="padding:6px 12px"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td></tr>
          <tr><td style="padding:6px 12px;color:#666">Phone</td><td style="padding:6px 12px"><a href="tel:${escapeHtml(data.phone)}">${escapeHtml(data.phone)}</a></td></tr>
          <tr><td style="padding:6px 12px;color:#666">Park</td><td style="padding:6px 12px">${escapeHtml(data.park) || "—"}</td></tr>
          <tr><td style="padding:6px 12px;color:#666">Date</td><td style="padding:6px 12px">${escapeHtml(data.date) || "—"}</td></tr>
          <tr><td style="padding:6px 12px;color:#666">Guests</td><td style="padding:6px 12px">${escapeHtml(data.guests) || "—"}</td></tr>
          <tr><td style="padding:6px 12px;color:#666;vertical-align:top">Message</td><td style="padding:6px 12px;white-space:pre-wrap">${escapeHtml(data.message) || "—"}</td></tr>
          <tr><td style="padding:6px 12px;color:#666">Received</td><td style="padding:6px 12px">${submittedAt}</td></tr>
        </table>
        <p style="font-family:system-ui,sans-serif;font-size:12px;color:#888;margin-top:24px">
          Logged in Sanity Studio under <strong>Enquiries</strong>.
        </p>
      `
      await resend.emails.send({
        from: fromEmail,
        to: ownerEmail,
        replyTo: data.email,
        subject,
        html,
      })
    } catch (err) {
      console.error("[enquiry] Resend send failed", err)
    }
  } else {
    console.warn(
      "[enquiry] RESEND_API_KEY or OWNER_EMAIL not set — skipping email notification",
    )
  }

  return NextResponse.json({ ok: true })
}
