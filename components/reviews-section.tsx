"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import Image from "next/image"
import { Star, ChevronLeft, ChevronRight, Quote, CheckCircle, PenLine } from "lucide-react"

export type Review = {
  id: string
  name: string
  location?: string
  rating: number
  journey?: string
  review: string
  submittedAt?: string
  /** Only used by hardcoded fallback reviews. Customer-submitted ones use initials. */
  image?: string
}

// Fallback used until the client has at least one approved review in Sanity.
// Once they have real ones, those replace these on the live site.
const FALLBACK_REVIEWS: Review[] = [
  {
    id: "fallback-1",
    name: "Rahul & Ananya Kapoor",
    location: "Mumbai",
    image: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=200&q=80",
    rating: 5,
    journey: "Ranthambore Safari",
    review:
      "An absolutely magical experience! We spotted three tigers on our first safari. The guides were incredibly knowledgeable and the luxury camp exceeded all expectations.",
    submittedAt: "2024-12-15T00:00:00Z",
  },
  {
    id: "fallback-2",
    name: "Sarah Mitchell",
    location: "London, UK",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    rating: 5,
    journey: "Kaziranga Expedition",
    review:
      "As a wildlife photographer, I've been on safaris worldwide, but nothing compares to the biodiversity of Kaziranga. Planet Canopy's attention to detail helped me capture shots I never thought possible.",
    submittedAt: "2025-01-20T00:00:00Z",
  },
  {
    id: "fallback-3",
    name: "The Patel Family",
    location: "Delhi",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
    rating: 5,
    journey: "Jim Corbett Family Safari",
    review:
      "Took our kids on their first safari and it was life-changing. The team ensured everything was child-friendly while maintaining the authenticity of the experience.",
    submittedAt: "2024-11-08T00:00:00Z",
  },
]

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "·"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function formatMonth(iso?: string): string {
  if (!iso) return ""
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ""
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" })
}

function StarRatingInput({
  value,
  onChange,
  disabled,
}: {
  value: number
  onChange: (v: number) => void
  disabled?: boolean
}) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = (hover || value) >= n
        return (
          <button
            key={n}
            type="button"
            disabled={disabled}
            onMouseEnter={() => setHover(n)}
            onClick={() => onChange(n)}
            className="p-1 transition-transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={`${n} star${n === 1 ? "" : "s"}`}
          >
            <Star
              className={`w-7 h-7 transition-colors ${
                filled ? "fill-primary text-primary" : "text-muted-foreground/40"
              }`}
            />
          </button>
        )
      })}
    </div>
  )
}

export function ReviewsSection({ reviews }: { reviews?: Review[] }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const list = reviews && reviews.length > 0 ? reviews : FALLBACK_REVIEWS
  const [currentIndex, setCurrentIndex] = useState(0)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: "",
    location: "",
    journey: "",
    rating: 5,
    review: "",
  })

  const safeIndex = Math.min(currentIndex, Math.max(list.length - 1, 0))
  const current = list[safeIndex]

  const nextReview = () => setCurrentIndex((p) => (p + 1) % list.length)
  const prevReview = () => setCurrentIndex((p) => (p - 1 + list.length) % list.length)

  const handleField = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          rating: Number(form.rating),
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error || "Something went wrong. Please try again.")
      }
      setIsSubmitted(true)
      setForm({ name: "", location: "", journey: "", rating: 5, review: "" })
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Submission failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="reviews" className="py-24 sm:py-32 bg-background overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-muted-foreground font-[var(--font-outfit)] text-sm tracking-[0.3em] uppercase mb-4">
            Testimonials
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground mb-6">
            Traveler Stories
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground font-[var(--font-outfit)] font-light text-lg leading-relaxed">
            Hear from adventurers who have experienced the magic of India&apos;s wildlife with us.
          </p>
        </motion.div>

        {/* Featured Review carousel */}
        {current && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative max-w-4xl mx-auto"
          >
            <div className="absolute -top-8 left-8 sm:left-12 text-primary/20">
              <Quote className="w-24 h-24" />
            </div>

            <div className="relative bg-card rounded-sm p-8 sm:p-12 shadow-lg">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
              >
                {/* Rating */}
                <div className="flex gap-1 mb-6">
                  {[...Array(current.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>

                {/* Review Text */}
                <blockquote className="text-xl sm:text-2xl text-foreground font-light leading-relaxed mb-8 italic">
                  &ldquo;{current.review}&rdquo;
                </blockquote>

                {/* Reviewer Info */}
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-primary/10 flex items-center justify-center">
                    {current.image ? (
                      <Image
                        src={current.image}
                        alt={current.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="font-[var(--font-outfit)] font-semibold text-primary text-base">
                        {initials(current.name)}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate">{current.name}</p>
                    <p className="text-sm text-muted-foreground font-[var(--font-outfit)] truncate">
                      {[current.location, current.journey].filter(Boolean).join(" • ") || "—"}
                    </p>
                  </div>
                  <div className="ml-auto text-right hidden sm:block">
                    <p className="text-sm text-muted-foreground font-[var(--font-outfit)]">
                      {formatMonth(current.submittedAt)}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Navigation */}
              {list.length > 1 && (
                <div className="flex items-center justify-between mt-8 pt-8 border-t border-border">
                  <div className="flex gap-2 flex-wrap">
                    {list.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === safeIndex ? "bg-primary" : "bg-border"
                        }`}
                        aria-label={`Go to review ${index + 1}`}
                      />
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={prevReview}
                      className="p-2 border border-border rounded-sm text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                      aria-label="Previous review"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextReview}
                      className="p-2 border border-border rounded-sm text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                      aria-label="Next review"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Share-your-story button + form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-2xl mx-auto mt-16"
        >
          {!isFormOpen && !isSubmitted && (
            <div className="text-center">
              <button
                onClick={() => setIsFormOpen(true)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground text-sm font-[var(--font-outfit)] tracking-wide uppercase rounded-sm hover:bg-primary/90 transition-colors duration-300"
              >
                <PenLine className="w-4 h-4" />
                Share Your Story
              </button>
              <p className="mt-3 text-xs text-muted-foreground font-[var(--font-outfit)]">
                Reviews are read by our team and published once approved.
              </p>
            </div>
          )}

          {isFormOpen && !isSubmitted && (
            <form
              onSubmit={handleSubmit}
              className="bg-card rounded-sm p-8 sm:p-10 shadow-lg space-y-5"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-semibold text-foreground">Share Your Story</h3>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="text-sm text-muted-foreground hover:text-foreground font-[var(--font-outfit)]"
                >
                  Cancel
                </button>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-[var(--font-outfit)] text-foreground mb-2">
                  Your rating *
                </label>
                <StarRatingInput
                  value={form.rating}
                  onChange={(v) => setForm({ ...form, rating: v })}
                  disabled={isSubmitting}
                />
              </div>

              {/* Name & Location */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="review-name"
                    className="block text-sm font-[var(--font-outfit)] text-foreground mb-2"
                  >
                    Your name *
                  </label>
                  <input
                    id="review-name"
                    name="name"
                    type="text"
                    required
                    maxLength={120}
                    value={form.name}
                    onChange={handleField}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-border rounded-sm bg-background text-foreground font-[var(--font-outfit)] focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label
                    htmlFor="review-location"
                    className="block text-sm font-[var(--font-outfit)] text-foreground mb-2"
                  >
                    Location
                  </label>
                  <input
                    id="review-location"
                    name="location"
                    type="text"
                    maxLength={120}
                    value={form.location}
                    onChange={handleField}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-border rounded-sm bg-background text-foreground font-[var(--font-outfit)] focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Mumbai, India"
                  />
                </div>
              </div>

              {/* Journey */}
              <div>
                <label
                  htmlFor="review-journey"
                  className="block text-sm font-[var(--font-outfit)] text-foreground mb-2"
                >
                  Trip / journey (optional)
                </label>
                <input
                  id="review-journey"
                  name="journey"
                  type="text"
                  maxLength={160}
                  value={form.journey}
                  onChange={handleField}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-border rounded-sm bg-background text-foreground font-[var(--font-outfit)] focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ranthambore Safari, March 2026"
                />
              </div>

              {/* Review */}
              <div>
                <label
                  htmlFor="review-text"
                  className="block text-sm font-[var(--font-outfit)] text-foreground mb-2"
                >
                  Your review *
                </label>
                <textarea
                  id="review-text"
                  name="review"
                  required
                  minLength={10}
                  maxLength={2000}
                  rows={5}
                  value={form.review}
                  onChange={handleField}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-border rounded-sm bg-background text-foreground font-[var(--font-outfit)] focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="What did you love about your safari with Planet Canopy?"
                />
                <p className="mt-1 text-xs text-muted-foreground font-[var(--font-outfit)]">
                  {form.review.length} / 2000
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-primary text-primary-foreground text-sm font-[var(--font-outfit)] tracking-wide uppercase rounded-sm hover:bg-primary/90 transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>

              {submitError && (
                <p className="text-center text-sm text-destructive [font-family:var(--font-outfit)]">
                  {submitError}
                </p>
              )}

              <p className="text-center text-xs text-muted-foreground font-[var(--font-outfit)]">
                Reviews appear publicly once approved by our team — usually within a day.
              </p>
            </form>
          )}

          {isSubmitted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card rounded-sm p-10 shadow-lg text-center"
            >
              <CheckCircle className="w-14 h-14 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-foreground mb-2">
                Thank you for sharing!
              </h3>
              <p className="text-muted-foreground font-[var(--font-outfit)]">
                We&apos;ve received your review and will publish it shortly after a quick check by our team.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false)
                  setIsFormOpen(false)
                }}
                className="mt-6 text-sm text-primary font-[var(--font-outfit)] tracking-wide uppercase hover:underline"
              >
                Close
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 flex flex-wrap justify-center items-center gap-8 sm:gap-16"
        >
          {[
            { value: "4.9/5", label: "Average Rating" },
            { value: "500+", label: "5-Star Reviews" },
            { value: "98%", label: "Would Recommend" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-3xl sm:text-4xl font-semibold text-foreground mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground font-[var(--font-outfit)] tracking-wide uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
