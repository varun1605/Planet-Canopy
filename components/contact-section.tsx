"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter, Youtube } from "lucide-react"
import Link from "next/link"

const quickLinks = [
  { name: "Home", href: "#home" },
  { name: "Safari Journeys", href: "#journeys" },
  { name: "Wildlife Gallery", href: "#gallery" },
  { name: "About Us", href: "#about" },
  { name: "Testimonials", href: "#reviews" },
  { name: "Book Now", href: "#booking" },
]

const destinations = [
  "Jim Corbett",
  "Ranthambore",
  "Kaziranga",
  "Bandhavgarh",
  "Kanha",
  "Gir Forest",
]

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "#", label: "YouTube" },
]

export function ContactSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="contact" className="bg-foreground text-primary-foreground" ref={ref}>
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary-foreground flex items-center justify-center">
                <span className="text-foreground text-xl font-bold">PC</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold tracking-wide">Planet Canopy</h3>
                <p className="text-xs text-primary-foreground/60 font-[var(--font-outfit)] tracking-widest uppercase">Wildlife Safaris</p>
              </div>
            </div>
            <p className="text-primary-foreground/70 font-[var(--font-outfit)] font-light leading-relaxed mb-6">
              Experience India&apos;s magnificent wildlife with premium, conservation-focused safari expeditions across the country&apos;s finest national parks.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="p-2.5 border border-primary-foreground/20 rounded-sm text-primary-foreground/60 hover:text-primary-foreground hover:border-primary-foreground/40 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-sm font-[var(--font-outfit)] tracking-[0.2em] uppercase text-primary-foreground/60 mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-primary-foreground/70 font-[var(--font-outfit)] hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Destinations */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-sm font-[var(--font-outfit)] tracking-[0.2em] uppercase text-primary-foreground/60 mb-6">
              Top Destinations
            </h4>
            <ul className="space-y-3">
              {destinations.map((dest) => (
                <li key={dest}>
                  <a
                    href="#journeys"
                    className="text-primary-foreground/70 font-[var(--font-outfit)] hover:text-primary-foreground transition-colors"
                  >
                    {dest}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="text-sm font-[var(--font-outfit)] tracking-[0.2em] uppercase text-primary-foreground/60 mb-6">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-foreground/60 flex-shrink-0 mt-0.5" />
                <span className="text-primary-foreground/70 font-[var(--font-outfit)]">
                  704 Vaikuntha Dham, Goregaon West,<br />Mumbai, Maharashtra 400104
                </span>
              </li>
              <li>
                <a href="tel:+918591893248" className="flex items-center gap-3 text-primary-foreground/70 font-[var(--font-outfit)] hover:text-primary-foreground transition-colors">
                  <Phone className="w-5 h-5 text-primary-foreground/60" />
                  +91 85918 93248
                </a>
              </li>
              <li>
                <a href="mailto:theplanetcanopy1@gmail.com" className="flex items-center gap-3 text-primary-foreground/70 font-[var(--font-outfit)] hover:text-primary-foreground transition-colors">
                  <Mail className="w-5 h-5 text-primary-foreground/60" />
                  theplanetcanopy1@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary-foreground/60" />
                <span className="text-primary-foreground/70 font-[var(--font-outfit)]">Mon - Sat: 9AM - 7PM IST</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-primary-foreground/50 font-[var(--font-outfit)]">
              © 2025 Planet Canopy. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-primary-foreground/50 font-[var(--font-outfit)]">
              <a href="#" className="hover:text-primary-foreground/70 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary-foreground/70 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary-foreground/70 transition-colors">Refund Policy</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
