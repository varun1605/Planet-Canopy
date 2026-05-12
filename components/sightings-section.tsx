"use client"

import { AnimatePresence, motion, useInView } from "framer-motion"
import { useMemo, useRef, useState } from "react"
import Image from "next/image"
import { MapPin, Calendar, User, ChevronDown, Search } from "lucide-react"
import { PARKS } from "@/lib/parks"

export type Sighting = {
  id: string
  park: string
  zone?: string
  species: string
  individual?: string
  description: string
  sightedAt: string
  reportedBy?: string
  imageUrl?: string
}

function formatSightingDate(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime()
  const now = Date.now()
  const days = Math.floor((now - then) / (1000 * 60 * 60 * 24))
  if (days === 0) return "Today"
  if (days === 1) return "Yesterday"
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? "s" : ""} ago`
  if (days < 365) return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? "s" : ""} ago`
  return `${Math.floor(days / 365)} year${Math.floor(days / 365) > 1 ? "s" : ""} ago`
}

function SightingCard({ s, index }: { s: Sighting; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="group relative flex flex-col bg-card rounded-sm overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
    >
      {s.imageUrl && (
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <Image
            src={s.imageUrl}
            alt={`${s.species} sighting at ${s.park}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      )}

      <div className="p-6 sm:p-7 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-[var(--font-outfit)] tracking-wide uppercase">
            <MapPin className="w-3.5 h-3.5" />
            <span>{s.park}</span>
            {s.zone && <span className="text-muted-foreground/50">·</span>}
            {s.zone && <span>{s.zone}</span>}
          </div>
          <span
            className="text-xs text-muted-foreground font-[var(--font-outfit)] whitespace-nowrap"
            title={formatSightingDate(s.sightedAt)}
          >
            {timeAgo(s.sightedAt)}
          </span>
        </div>

        <h3 className="text-2xl font-semibold text-foreground mb-2 leading-tight">
          {s.species}
          {s.individual && (
            <span className="block text-sm font-[var(--font-outfit)] font-light text-primary uppercase tracking-wider mt-1">
              {s.individual}
            </span>
          )}
        </h3>

        <p className="text-muted-foreground font-[var(--font-outfit)] font-light leading-relaxed flex-1">
          {s.description}
        </p>

        <div className="mt-5 pt-4 border-t border-border flex items-center gap-2 text-xs text-muted-foreground font-[var(--font-outfit)]">
          {s.reportedBy ? (
            <>
              <User className="w-3.5 h-3.5" />
              <span>Reported by {s.reportedBy}</span>
            </>
          ) : (
            <>
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatSightingDate(s.sightedAt)}</span>
            </>
          )}
        </div>
      </div>
    </motion.article>
  )
}

function EmptyState({ park }: { park: string }) {
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-xl mx-auto text-center py-12 sm:py-16"
    >
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
        <Search className="w-7 h-7 text-primary" strokeWidth={1.5} />
      </div>
      <h3 className="text-2xl sm:text-3xl font-semibold text-foreground mb-3">
        No recent sightings at {park}
      </h3>
      <p className="text-muted-foreground font-[var(--font-outfit)] font-light text-base sm:text-lg leading-relaxed mb-8">
        Our network of guides hasn&apos;t logged anything new here yet.
        New sightings are reported weekly — check back soon, or plan a trip and you might be the next one to spot a tiger here.
      </p>
      <a
        href="#booking"
        className="inline-flex items-center gap-2 px-7 py-3 bg-primary text-primary-foreground text-sm font-[var(--font-outfit)] tracking-wide uppercase rounded-sm hover:bg-primary/90 transition-colors duration-300"
      >
        Plan a {park} Safari
      </a>
    </motion.div>
  )
}

export function SightingsSection({ sightings }: { sightings?: Sighting[] }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPark, setSelectedPark] = useState<string | null>(null)

  // Map park → count of approved sightings, so we can show a badge.
  const countsByPark = useMemo(() => {
    const c: Record<string, number> = {}
    for (const s of sightings ?? []) c[s.park] = (c[s.park] || 0) + 1
    return c
  }, [sightings])

  const filtered = useMemo(() => {
    if (!sightings || !selectedPark) return []
    return sightings.filter((s) => s.park === selectedPark)
  }, [sightings, selectedPark])

  return (
    <section id="sightings" className="py-24 sm:py-32 bg-secondary" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <p className="text-muted-foreground font-[var(--font-outfit)] text-sm tracking-[0.3em] uppercase">
              Live Updates
            </p>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground mb-6">
            Recent Wildlife Sightings
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground font-[var(--font-outfit)] font-light text-lg leading-relaxed">
            Real-time reports from our network of guides and naturalists across India&apos;s tiger reserves.
          </p>
        </motion.div>

        {/* Collapsible toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-center mb-10"
        >
          <button
            onClick={() => setIsOpen((v) => !v)}
            aria-expanded={isOpen}
            aria-controls="sightings-explorer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background text-sm font-[var(--font-outfit)] tracking-wide uppercase rounded-sm hover:bg-foreground/90 transition-colors duration-300"
          >
            <span>{isOpen ? "Hide" : "Explore Sightings by Park"}</span>
            <motion.span
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="inline-flex"
            >
              <ChevronDown className="w-4 h-4" />
            </motion.span>
          </button>
        </motion.div>

        {/* Expandable explorer */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="explorer"
              id="sightings-explorer"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="pt-4">
                {/* Park pills */}
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12 max-w-4xl mx-auto">
                  {PARKS.map((park) => {
                    const isActive = selectedPark === park
                    const count = countsByPark[park] || 0
                    return (
                      <button
                        key={park}
                        onClick={() => setSelectedPark(park)}
                        className={`group inline-flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-[var(--font-outfit)] tracking-wide transition-all duration-200 ${
                          isActive
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background text-foreground border-border hover:border-foreground"
                        }`}
                      >
                        <span>{park}</span>
                        {count > 0 && (
                          <span
                            className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-semibold rounded-full ${
                              isActive
                                ? "bg-primary-foreground/20 text-primary-foreground"
                                : "bg-primary/10 text-primary"
                            }`}
                          >
                            {count}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Sightings display, empty state, or prompt */}
                <AnimatePresence mode="wait">
                  {!selectedPark && (
                    <motion.p
                      key="prompt"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center text-muted-foreground font-[var(--font-outfit)] py-12 sm:py-16"
                    >
                      Select a park above to see its latest sightings.
                    </motion.p>
                  )}

                  {selectedPark && filtered.length > 0 && (
                    <motion.div
                      key={`grid-${selectedPark}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                      {filtered.map((s, i) => (
                        <SightingCard key={s.id} s={s} index={i} />
                      ))}
                    </motion.div>
                  )}

                  {selectedPark && filtered.length === 0 && (
                    <EmptyState key={`empty-${selectedPark}`} park={selectedPark} />
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
