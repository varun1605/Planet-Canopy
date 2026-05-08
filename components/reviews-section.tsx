"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState } from "react"
import Image from "next/image"
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react"

const reviews = [
  {
    id: 1,
    name: "Rahul & Ananya Kapoor",
    location: "Mumbai",
    image: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=200&q=80",
    rating: 5,
    journey: "Ranthambore Safari",
    review: "An absolutely magical experience! We spotted three tigers on our first safari. The guides were incredibly knowledgeable and the luxury camp exceeded all expectations. Planet Canopy made our honeymoon unforgettable.",
    date: "December 2024",
  },
  {
    id: 2,
    name: "Sarah Mitchell",
    location: "London, UK",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    rating: 5,
    journey: "Kaziranga Expedition",
    review: "As a wildlife photographer, I've been on safaris worldwide, but nothing compares to the biodiversity of Kaziranga. Planet Canopy's attention to detail and expert naturalists helped me capture shots I never thought possible.",
    date: "January 2025",
  },
  {
    id: 3,
    name: "The Patel Family",
    location: "Delhi",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
    rating: 5,
    journey: "Jim Corbett Family Safari",
    review: "Took our kids on their first safari and it was life-changing. The team ensured everything was child-friendly while maintaining the authenticity of the experience. Our daughter hasn't stopped talking about the elephants!",
    date: "November 2024",
  },
  {
    id: 4,
    name: "David Chen",
    location: "Singapore",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    rating: 5,
    journey: "Bandhavgarh Tiger Trail",
    review: "Third safari with Planet Canopy and they never disappoint. The tiger sighting rate is incredible, and the conservation stories shared by guides give you a deeper appreciation for these magnificent creatures.",
    date: "February 2025",
  },
]

export function ReviewsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length)
  }

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
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

        {/* Featured Review */}
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
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(reviews[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>

              {/* Review Text */}
              <blockquote className="text-xl sm:text-2xl text-foreground font-light leading-relaxed mb-8 italic">
                &ldquo;{reviews[currentIndex].review}&rdquo;
              </blockquote>

              {/* Reviewer Info */}
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden">
                  <Image
                    src={reviews[currentIndex].image}
                    alt={reviews[currentIndex].name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{reviews[currentIndex].name}</p>
                  <p className="text-sm text-muted-foreground font-[var(--font-outfit)]">
                    {reviews[currentIndex].location} • {reviews[currentIndex].journey}
                  </p>
                </div>
                <div className="ml-auto text-right hidden sm:block">
                  <p className="text-sm text-muted-foreground font-[var(--font-outfit)]">
                    {reviews[currentIndex].date}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-8 border-t border-border">
              <div className="flex gap-2">
                {reviews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentIndex ? "bg-primary" : "bg-border"
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
          </div>
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
