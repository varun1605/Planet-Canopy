"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import Image from "next/image"
import { Instagram, Linkedin, Award, Heart, Globe } from "lucide-react"

const founders = [
  {
    name: "Arjun Sharma",
    role: "Co-Founder & Safari Expert",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    bio: "With over 15 years of wildlife photography and safari expertise, Arjun has led expeditions across every major national park in India.",
    social: {
      instagram: "#",
      linkedin: "#",
    },
  },
  {
    name: "Priya Menon",
    role: "Co-Founder & Conservation Lead",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    bio: "A wildlife biologist turned entrepreneur, Priya ensures every safari contributes to local conservation efforts and community development.",
    social: {
      instagram: "#",
      linkedin: "#",
    },
  },
]

const values = [
  {
    icon: Award,
    title: "Excellence",
    description: "Premium safari experiences with expert naturalists and top-tier accommodations.",
  },
  {
    icon: Heart,
    title: "Conservation",
    description: "10% of every booking goes directly to wildlife conservation projects.",
  },
  {
    icon: Globe,
    title: "Sustainability",
    description: "Eco-friendly practices that minimize our footprint on precious ecosystems.",
  },
]

export function AboutSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="about" className="py-24 sm:py-32 bg-secondary" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="text-muted-foreground font-[var(--font-outfit)] text-sm tracking-[0.3em] uppercase mb-4">
            Our Story
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground mb-6">
            Meet the Founders
          </h2>
          <p className="max-w-3xl mx-auto text-muted-foreground font-[var(--font-outfit)] font-light text-lg leading-relaxed">
            Planet Canopy was born from a shared passion for wildlife and a dream to make India&apos;s 
            incredible biodiversity accessible to nature lovers worldwide.
          </p>
        </motion.div>

        {/* Founders */}
        <div className="grid md:grid-cols-2 gap-12 mb-24">
          {founders.map((founder, index) => (
            <motion.div
              key={founder.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="flex flex-col sm:flex-row gap-6 items-start"
            >
              <div className="relative w-full sm:w-48 h-64 sm:h-64 flex-shrink-0 overflow-hidden rounded-sm">
                <Image
                  src={founder.image}
                  alt={founder.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-foreground mb-1">{founder.name}</h3>
                <p className="text-primary font-[var(--font-outfit)] text-sm tracking-wide uppercase mb-4">
                  {founder.role}
                </p>
                <p className="text-muted-foreground font-[var(--font-outfit)] font-light leading-relaxed mb-6">
                  {founder.bio}
                </p>
                <div className="flex gap-4">
                  <a
                    href={founder.social.instagram}
                    className="p-2 border border-border rounded-sm text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                    aria-label={`${founder.name}'s Instagram`}
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href={founder.social.linkedin}
                    className="p-2 border border-border rounded-sm text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                    aria-label={`${founder.name}'s LinkedIn`}
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-primary text-primary-foreground rounded-sm p-8 sm:p-12 mb-24"
        >
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-primary-foreground/80 font-[var(--font-outfit)] text-sm tracking-[0.3em] uppercase mb-6">
              Our Mission
            </p>
            <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-light leading-relaxed italic">
              &ldquo;To create transformative wildlife experiences that inspire conservation, 
              support local communities, and awaken a deep connection with nature.&rdquo;
            </blockquote>
          </div>
        </motion.div>

        {/* Values */}
        <div className="grid sm:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <value.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{value.title}</h3>
              <p className="text-muted-foreground font-[var(--font-outfit)] font-light leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
