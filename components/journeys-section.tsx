"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState } from "react"
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react"
import Image from "next/image"

export type Journey = {
  id: string | number
  title: string
  location: string
  duration: string
  date: string
  image: string
  description: string
  price: string
  highlights: string[]
}

const fallbackJourneys: Journey[] = [
  {
    id: 1,
    title: "Jim Corbett National Park",
    location: "Uttarakhand",
    duration: "3 Days / 2 Nights",
    date: "Available Year Round",
    image: "https://images.unsplash.com/photo-1549366021-9f761d450615?w=800&q=80",
    description: "India's oldest national park, home to the majestic Bengal tiger and diverse wildlife.",
    price: "₹24,999",
    highlights: ["Tiger Safari", "Elephant Ride", "Bird Watching"],
  },
  {
    id: 2,
    title: "Ranthambore National Park",
    location: "Rajasthan",
    duration: "4 Days / 3 Nights",
    date: "Oct - Jun",
    image: "https://images.unsplash.com/photo-1615824996195-f780bba7cfab?w=800&q=80",
    description: "Former hunting grounds of the Maharajas, now a tiger reserve with ancient fort ruins.",
    price: "₹32,999",
    highlights: ["Tiger Spotting", "Fort Visit", "Luxury Camp"],
  },
  {
    id: 3,
    title: "Kaziranga National Park",
    location: "Assam",
    duration: "5 Days / 4 Nights",
    date: "Nov - Apr",
    image: "https://images.unsplash.com/photo-1581852017103-68ac65514cf7?w=800&q=80",
    description: "Home to two-thirds of the world's one-horned rhinoceros population.",
    price: "₹38,999",
    highlights: ["Rhino Safari", "Jeep Safari", "Tea Garden Visit"],
  },
  {
    id: 4,
    title: "Bandhavgarh National Park",
    location: "Madhya Pradesh",
    duration: "3 Days / 2 Nights",
    date: "Oct - Jun",
    image: "https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=800&q=80",
    description: "Highest density of Bengal tigers in India with ancient caves and fort.",
    price: "₹28,999",
    highlights: ["High Tiger Density", "Cave Exploration", "Nature Walks"],
  },
]

export function JourneysSection({ journeys = fallbackJourneys }: { journeys?: Journey[] } = {}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [hoveredId, setHoveredId] = useState<string | number | null>(null)

  return (
    <section id="journeys" className="py-24 sm:py-32 bg-secondary" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-muted-foreground font-[var(--font-outfit)] text-sm tracking-[0.3em] uppercase mb-4">
            Upcoming Adventures
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground mb-6">
            Our Safari Journeys
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground font-[var(--font-outfit)] font-light text-lg leading-relaxed">
            Curated wildlife experiences across India&apos;s most spectacular national parks and tiger reserves.
          </p>
        </motion.div>

        {/* Journey Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {journeys.map((journey, index) => (
            <motion.div
              key={journey.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              onMouseEnter={() => setHoveredId(journey.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group relative bg-card rounded-sm overflow-hidden shadow-lg cursor-pointer"
            >
              {/* Image */}
              <div className="relative h-64 sm:h-72 overflow-hidden">
                <Image
                  src={journey.image}
                  alt={journey.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                
                {/* Price Badge */}
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-sm">
                  <span className="font-[var(--font-outfit)] text-sm font-medium">{journey.price}</span>
                </div>

                {/* Highlights */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={hoveredId === journey.id ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2"
                >
                  {journey.highlights.map((highlight, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-primary-foreground/90 text-foreground text-xs font-[var(--font-outfit)] rounded-sm"
                    >
                      {highlight}
                    </span>
                  ))}
                </motion.div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground font-[var(--font-outfit)]">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {journey.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {journey.duration}
                  </span>
                </div>

                <h3 className="text-2xl font-semibold text-foreground mb-3">{journey.title}</h3>
                <p className="text-muted-foreground font-[var(--font-outfit)] font-light mb-4 line-clamp-2">
                  {journey.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground font-[var(--font-outfit)]">
                    <Calendar className="w-4 h-4" />
                    {journey.date}
                  </span>
                  <motion.span
                    className="flex items-center gap-2 text-primary font-[var(--font-outfit)] text-sm font-medium"
                    animate={{ x: hoveredId === journey.id ? 5 : 0 }}
                  >
                    View Details <ArrowRight className="w-4 h-4" />
                  </motion.span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <a
            href="#booking"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground text-sm font-[var(--font-outfit)] tracking-wide uppercase rounded-sm hover:bg-primary/90 transition-all duration-300"
          >
            View All Journeys <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
