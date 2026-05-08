"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState } from "react"
import { Calendar, Users, MapPin, Phone, Mail, CheckCircle } from "lucide-react"

const parks = [
  "Jim Corbett National Park",
  "Ranthambore National Park",
  "Kaziranga National Park",
  "Bandhavgarh National Park",
  "Kanha National Park",
  "Gir National Park",
  "Sundarbans National Park",
  "Periyar National Park",
]

export function BookingSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    park: "",
    date: "",
    guests: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error || "Something went wrong. Please try again.")
      }
      setIsSubmitted(true)
      setFormData({
        name: "",
        email: "",
        phone: "",
        park: "",
        date: "",
        guests: "",
        message: "",
      })
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Submission failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <section id="booking" className="py-24 sm:py-32 bg-primary" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p className="text-primary-foreground/80 font-[var(--font-outfit)] text-sm tracking-[0.3em] uppercase mb-4">
              Book Your Adventure
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-primary-foreground mb-6">
              Start Your Safari Journey
            </h2>
            <p className="text-primary-foreground/80 font-[var(--font-outfit)] font-light text-lg leading-relaxed mb-12">
              Ready to experience India&apos;s incredible wildlife? Fill out the form and our safari 
              experts will craft a personalized itinerary just for you.
            </p>

            {/* Features */}
            <div className="space-y-6">
              {[
                "Personalized safari itineraries",
                "Expert wildlife naturalists",
                "Luxury eco-friendly accommodations",
                "Small group sizes (max 6 guests)",
                "Flexible booking & cancellation",
              ].map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-primary-foreground/80 flex-shrink-0" />
                  <span className="text-primary-foreground font-[var(--font-outfit)]">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* Contact Info */}
            <div className="mt-12 pt-12 border-t border-primary-foreground/20 space-y-4">
              <a href="tel:+918591893248" className="flex items-center gap-3 text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <Phone className="w-5 h-5" />
                <span className="font-[var(--font-outfit)]">+91 85918 93248</span>
              </a>
              <a href="mailto:theplanetcanopy1@gmail.com" className="flex items-center gap-3 text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <Mail className="w-5 h-5" />
                <span className="font-[var(--font-outfit)]">theplanetcanopy1@gmail.com</span>
              </a>
            </div>
          </motion.div>

          {/* Booking Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="bg-card rounded-sm p-8 sm:p-10 shadow-2xl">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-foreground mb-2">Thank You!</h3>
                  <p className="text-muted-foreground font-[var(--font-outfit)]">
                    We&apos;ve received your inquiry and will contact you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <>
                  <h3 className="text-2xl font-semibold text-foreground mb-8">Request a Quote</h3>
                  
                  <div className="space-y-6">
                    {/* Name & Email */}
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-[var(--font-outfit)] text-foreground mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-border rounded-sm bg-background text-foreground font-[var(--font-outfit)] focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-[var(--font-outfit)] text-foreground mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-border rounded-sm bg-background text-foreground font-[var(--font-outfit)] focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-[var(--font-outfit)] text-foreground mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 border border-border rounded-sm bg-background text-foreground font-[var(--font-outfit)] focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>

                    {/* Park Selection */}
                    <div>
                      <label htmlFor="park" className="block text-sm font-[var(--font-outfit)] text-foreground mb-2">
                        Preferred National Park *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <select
                          id="park"
                          name="park"
                          required
                          value={formData.park}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 border border-border rounded-sm bg-background text-foreground font-[var(--font-outfit)] focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                        >
                          <option value="">Select a park</option>
                          {parks.map((park) => (
                            <option key={park} value={park}>{park}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Date & Guests */}
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="date" className="block text-sm font-[var(--font-outfit)] text-foreground mb-2">
                          Preferred Date *
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input
                            type="date"
                            id="date"
                            name="date"
                            required
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-3 border border-border rounded-sm bg-background text-foreground font-[var(--font-outfit)] focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="guests" className="block text-sm font-[var(--font-outfit)] text-foreground mb-2">
                          Number of Guests *
                        </label>
                        <div className="relative">
                          <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <select
                            id="guests"
                            name="guests"
                            required
                            value={formData.guests}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-3 border border-border rounded-sm bg-background text-foreground font-[var(--font-outfit)] focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                          >
                            <option value="">Select</option>
                            {[1, 2, 3, 4, 5, 6].map((num) => (
                              <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-[var(--font-outfit)] text-foreground mb-2">
                        Additional Requirements
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-border rounded-sm bg-background text-foreground font-[var(--font-outfit)] focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                        placeholder="Tell us about any special requirements, interests, or questions..."
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-primary text-primary-foreground text-sm font-[var(--font-outfit)] tracking-wide uppercase rounded-sm hover:bg-primary/90 transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Sending..." : "Send Inquiry"}
                    </button>

                    {submitError && (
                      <p className="text-center text-sm text-destructive [font-family:var(--font-outfit)]">
                        {submitError}
                      </p>
                    )}

                    <p className="text-center text-xs text-muted-foreground font-[var(--font-outfit)]">
                      By submitting, you agree to our privacy policy. We&apos;ll respond within 24 hours.
                    </p>
                  </div>
                </>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
