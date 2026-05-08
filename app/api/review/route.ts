import { NextResponse } from "next/server"
import { Resend } from "resend"
import { z } from "zod"
import { sanityWriteClient } from "@/lib/sanity"

export const runtime = "nodejs"

const ReviewSchema = z.object({
  name: z.string().trim().min(1).max(120),
  location: z.string().trim().max(120).optional().default(""),
  journey: z.string().trim().max(160).optional().default(""),
  rating: z.number().int().min(1).max(5),
  review: z.string().trim().min(10).max(2000),
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

  const parsed = ReviewSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const data = parsed.data
  const submittedAt = new Date().toISOString()

  // 1. Save to Sanity — approved=false so it doesn't appear publicly until
  //    the owner reviews and approves it in Sanity Studio.
  let docId: string | undefined
  try {
    const doc = await sanityWriteClient.create({
      _type: "review",
      ...data,
      submittedAt,
      approved: false,
    })
    docId = doc._id
  } catch (err) {
    console.error("[review] Sanity write failed", err)
    return NextResponse.json(
      { error: "Could not save review. Please try again." },
      { status: 502 },
    )
  }

  // 2. Notify the owner (best-effort).
  const resendKey = process.env.RESEND_API_KEY
  const ownerEmail = process.env.OWNER_EMAIL
  const fromEmail =
    process.env.RESEND_FROM_EMAIL || "Planet Canopy <onboarding@resend.dev>"

  if (resendKey && ownerEmail) {
    try {
      const resend = new Resend(resendKey)
      const stars = "★".repeat(data.rating) + "☆".repeat(5 - data.rating)
      const subject = `New review awaiting your approval — ${data.name} (${data.rating}★)`
      const html = `
        <h2 style="font-family:system-ui,sans-serif">New review submitted</h2>
        <p style="font-family:system-ui,sans-serif;color:#555">A customer left a review on your website. It is <strong>not yet visible publicly</strong> — open Sanity Studio → Review to read, edit, and approve it.</p>
        <table style="font-family:system-ui,sans-serif;border-collapse:collapse;font-size:14px;margin-top:14px">
          <tr><td style="padding:6px 12px;color:#666">Name</td><td style="padding:6px 12px"><strong>${escapeHtml(data.name)}</strong></td></tr>
          <tr><td style="padding:6px 12px;color:#666">Location</td><td style="padding:6px 12px">${escapeHtml(data.location) || "—"}</td></tr>
          <tr><td style="padding:6px 12px;color:#666">Trip / Journey</td><td style="padding:6px 12px">${escapeHtml(data.journey) || "—"}</td></tr>
          <tr><td style="padding:6px 12px;color:#666">Rating</td><td style="padding:6px 12px"><span style="font-size:18px;color:#b89968">${stars}</span> (${data.rating}/5)</td></tr>
          <tr><td style="padding:6px 12px;color:#666;vertical-align:top">Review</td><td style="padding:6px 12px;white-space:pre-wrap">${escapeHtml(data.review)}</td></tr>
          <tr><td style="padding:6px 12px;color:#666">Submitted</td><td style="padding:6px 12px">${submittedAt}</td></tr>
        </table>
        <p style="font-family:system-ui,sans-serif;font-size:13px;margin-top:24px">
          <strong>To make this review live</strong>: open Sanity Studio → <strong>Review</strong> tab → open the entry titled "${escapeHtml(data.name)}" → toggle <strong>Approved</strong> ON → click <strong>Publish</strong>.
        </p>
        <p style="font-family:system-ui,sans-serif;font-size:11px;color:#888">
          Document ID: ${docId || "(unknown)"}
        </p>
      `
      await resend.emails.send({
        from: fromEmail,
        to: ownerEmail,
        subject,
        html,
      })
    } catch (err) {
      console.error("[review] Resend send failed", err)
    }
  } else {
    console.warn(
      "[review] RESEND_API_KEY or OWNER_EMAIL not set — skipping email notification",
    )
  }

  return NextResponse.json({ ok: true })
}
