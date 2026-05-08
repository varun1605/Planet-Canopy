"use client"

import { motion } from "framer-motion"
import { Menu, X, ShoppingBag } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "Journeys", href: "#journeys" },
  { name: "Gallery", href: "#gallery" },
  { name: "About", href: "#about" },
  { name: "Reviews", href: "#reviews" },
  { name: "Contact", href: "#contact" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeHref, setActiveHref] = useState("#home")

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-linear-to-b from-black/85 via-black/50 to-transparent"
    >
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-3 items-center h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Left column: hamburger (mobile/tablet) or nav links (desktop xl+) */}
          <div className="flex items-center min-w-0 justify-self-start">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="xl:hidden p-2 -ml-2 text-white"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="hidden xl:flex items-center gap-4 2xl:gap-6">
              {navLinks.map((link) => {
                const isActive = activeHref === link.href
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setActiveHref(link.href)}
                    className={`relative text-xs 2xl:text-sm tracking-[0.15em] uppercase transition-colors duration-300 [font-family:var(--font-outfit)] whitespace-nowrap ${
                      isActive ? "text-white" : "text-white/75 hover:text-white"
                    } ${
                      isActive
                        ? "after:absolute after:left-0 after:right-0 after:-bottom-1.5 after:h-px after:bg-white"
                        : ""
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Center column: brand */}
          <Link href="#home" className="justify-self-center min-w-0">
            <span className="[font-family:var(--font-cormorant)] text-lg sm:text-2xl md:text-3xl xl:text-3xl 2xl:text-4xl text-white tracking-[0.08em] uppercase font-light whitespace-nowrap block">
              Planet Canopy
            </span>
          </Link>

          {/* Right column: CTA (desktop) + cart (always) */}
          <div className="flex items-center gap-2 sm:gap-3 justify-self-end min-w-0">
            <Link
              href="#booking"
              className="hidden xl:inline-flex px-4 2xl:px-5 py-2.5 2xl:py-3 bg-[#b89968] text-white text-xs 2xl:text-sm tracking-[0.15em] uppercase hover:bg-[#a88857] transition-colors duration-300 [font-family:var(--font-outfit)] whitespace-nowrap"
            >
              Enquire Now
            </Link>
            <button
              aria-label="Cart"
              className="p-2 -mr-2 sm:mr-0 text-white/80 hover:text-white transition-colors"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / tablet menu (under xl breakpoint) */}
      <motion.div
        initial={false}
        animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        className="xl:hidden overflow-hidden bg-[#1a1a1a] border-t border-white/10"
      >
        <div className="px-4 py-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => {
                setIsOpen(false)
                setActiveHref(link.href)
              }}
              className="block text-sm tracking-[0.22em] uppercase text-white/80 hover:text-white transition-colors duration-300 [font-family:var(--font-outfit)]"
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="#booking"
            onClick={() => setIsOpen(false)}
            className="block w-full text-center px-6 py-3 bg-[#b89968] text-white text-sm tracking-[0.22em] uppercase [font-family:var(--font-outfit)]"
          >
            Enquire Now
          </Link>
        </div>
      </motion.div>
    </motion.nav>
  )
}
