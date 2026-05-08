"use client"

import { AnimatePresence, motion } from "framer-motion"
import { ArrowDown, MapPin, Calendar, Users } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

const HERO_IMAGES = [
  "/marquee.jpeg",
  "/marquee1.jpeg",
  "/marquee2.jpeg",
  "/marquee3.jpeg",
  "/marquee4.jpeg",
  "/marquee5.jpeg",
  "/marquee6.jpeg",
  "/marquee7.jpeg",
  "/marquee8.jpeg",
  "/marquee9.jpeg",
]

const SLIDE_INTERVAL_MS = 5000
const FADE_DURATION_S = 1.6

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function HeroSection() {
  const [order, setOrder] = useState<string[]>(HERO_IMAGES)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    setOrder(shuffle(HERO_IMAGES))
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % order.length)
    }, SLIDE_INTERVAL_MS)
    return () => clearInterval(id)
  }, [order.length])

  useEffect(() => {
    if (typeof window === "undefined") return
    const next = new window.Image()
    next.src = order[(index + 1) % order.length]
  }, [index, order])

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence>
          <motion.div
            key={order[index]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: FADE_DURATION_S, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={order[index]}
              alt="Planet Canopy hero"
              fill
              className="object-cover object-right"
              priority={index === 0}
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/40 to-foreground/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-primary-foreground/80 font-[var(--font-outfit)] text-sm sm:text-base tracking-[0.3em] uppercase mb-6 font-semibold">
              Discover India&apos;s Wilderness
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold text-primary-foreground leading-tight mb-8"
          >
            <span className="block">Journey Beyond</span>
            <span className="block italic">Ordinary</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-2xl mx-auto text-lg sm:text-xl text-primary-foreground/90 [font-family:var(--font-outfit)] font-light leading-relaxed mb-12 [text-shadow:0_1px_8px_rgba(0,0,0,0.4)]"
          >
            Experience the majesty of India&apos;s finest national parks. From the royal tigers of Ranthambore 
            to the one-horned rhinos of Kaziranga, embark on unforgettable safari adventures.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <a
              href="#journeys"
              className="px-8 py-4 bg-primary-foreground text-foreground text-sm font-[var(--font-outfit)] tracking-wide uppercase rounded-sm hover:bg-primary-foreground/90 transition-all duration-300"
            >
              Explore Journeys
            </a>
            <a
              href="#about"
              className="px-8 py-4 border border-primary-foreground/50 text-primary-foreground text-sm font-[var(--font-outfit)] tracking-wide uppercase rounded-sm hover:bg-primary-foreground/10 transition-all duration-300"
            >
              Our Story
            </a>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-20 grid grid-cols-3 gap-8 max-w-3xl mx-auto"
        >
          {[
            { icon: MapPin, value: "15+", label: "National Parks" },
            { icon: Calendar, value: "500+", label: "Safari Tours" },
            { icon: Users, value: "10K+", label: "Happy Travelers" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <stat.icon className="w-6 h-6 text-primary-foreground/60 mx-auto mb-3" />
              <p className="text-3xl sm:text-4xl font-semibold text-primary-foreground mb-1">{stat.value}</p>
              <p className="text-xs sm:text-sm text-primary-foreground/60 font-[var(--font-outfit)] tracking-wide uppercase">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs text-primary-foreground/60 font-[var(--font-outfit)] tracking-widest uppercase">Scroll</span>
            <ArrowDown className="w-5 h-5 text-primary-foreground/60" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
