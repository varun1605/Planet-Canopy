"use client"

import { AnimatePresence, motion, useInView } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"

export type GalleryPhoto = {
  id: string
  assetId: string
  caption?: string
}

const GRID_CELLS = [
  { span: "col-span-2 row-span-2" },
  { span: "col-span-1 row-span-1" },
  { span: "col-span-1 row-span-1" },
  { span: "col-span-1 row-span-1" },
  { span: "col-span-1 row-span-2" },
  { span: "col-span-2 row-span-1" },
  { span: "col-span-1 row-span-1" },
  { span: "col-span-1 row-span-1" },
]

const CELL_INTERVAL_MS = 5000
const CELL_STAGGER_MS = 600
const FADE_DURATION_S = 1.4

const thumbUrl = (assetId: string) => `/api/gallery-photo/${assetId}/thumb`
const fullUrl = (assetId: string) => `/api/gallery-photo/${assetId}/full`

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function GalleryCell({
  span,
  pool,
  cellIndex,
  onSelect,
  inView,
  delay,
}: {
  span: string
  pool: GalleryPhoto[]
  cellIndex: number
  onSelect: (photo: GalleryPhoto) => void
  inView: boolean
  delay: number
}) {
  const [index, setIndex] = useState(cellIndex % Math.max(pool.length, 1))

  useEffect(() => {
    if (pool.length === 0) return
    let intervalId: ReturnType<typeof setInterval> | null = null
    const startTimeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        setIndex((i) => (i + GRID_CELLS.length) % pool.length)
      }, CELL_INTERVAL_MS)
    }, cellIndex * CELL_STAGGER_MS)

    return () => {
      clearTimeout(startTimeoutId)
      if (intervalId) clearInterval(intervalId)
    }
  }, [cellIndex, pool.length])

  // Preload the next image so the crossfade lands on a fully-loaded frame.
  useEffect(() => {
    if (typeof window === "undefined" || pool.length === 0) return
    const next = pool[(index + GRID_CELLS.length) % pool.length]
    if (!next) return
    const preload = new window.Image()
    preload.src = thumbUrl(next.assetId)
  }, [index, pool])

  const photo = pool[index]
  if (!photo) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay }}
      className={`relative group cursor-pointer overflow-hidden rounded-sm bg-muted select-none ${span}`}
      onClick={() => onSelect(photo)}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      <AnimatePresence>
        <motion.div
          key={photo.assetId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: FADE_DURATION_S, ease: "easeInOut" }}
          className="absolute inset-0 pointer-events-none"
        >
          <Image
            src={thumbUrl(photo.assetId)}
            alt={photo.caption || "Wildlife from our safari expeditions"}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            draggable={false}
            unoptimized
            className="object-cover transition-transform duration-700 group-hover:scale-110 select-none [-webkit-user-drag:none]"
            priority={cellIndex === 0}
          />
        </motion.div>
      </AnimatePresence>
      <div
        aria-hidden
        className="absolute inset-0 z-10"
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
      />
      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-all duration-300 pointer-events-none" />
    </motion.div>
  )
}

export function GallerySection({ photos }: { photos?: GalleryPhoto[] }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [pool, setPool] = useState<GalleryPhoto[]>(photos ?? [])
  const [selected, setSelected] = useState<GalleryPhoto | null>(null)

  useEffect(() => {
    if (photos && photos.length > 0) setPool(shuffle(photos))
  }, [photos])

  return (
    <section id="gallery" className="py-24 sm:py-32 bg-background" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-muted-foreground font-[var(--font-outfit)] text-sm tracking-[0.3em] uppercase mb-4">
            Visual Stories
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground mb-6">
            Wildlife Gallery
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground font-[var(--font-outfit)] font-light text-lg leading-relaxed">
            Captured moments from our safari expeditions across India&apos;s magnificent wilderness.
          </p>
        </motion.div>

        {/* Gallery Grid */}
        {pool.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
            {GRID_CELLS.map((cell, i) => (
              <GalleryCell
                key={i}
                span={cell.span}
                pool={pool}
                cellIndex={i}
                onSelect={setSelected}
                inView={isInView}
                delay={i * 0.08}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground font-[var(--font-outfit)] py-12">
            New wildlife photographs from our latest expeditions will appear here soon.
          </p>
        )}

        {/* Marquee Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 overflow-hidden"
        >
          <motion.div
            animate={{ x: [0, -1000] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="flex gap-8 whitespace-nowrap"
          >
            {[...Array(4)].map((_, i) => (
              <span key={i} className="text-6xl sm:text-8xl font-semibold text-border/50 select-none">
                Tigers • Elephants • Leopards • Rhinos • Birds • Nature •{" "}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Lightbox — uses the watermarked /full endpoint */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/90 p-4"
            onClick={() => setSelected(null)}
          >
            <button
              className="absolute top-6 right-6 text-primary-foreground hover:text-primary-foreground/80 transition-colors"
              onClick={() => setSelected(null)}
              aria-label="Close lightbox"
            >
              <X className="w-8 h-8" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl max-h-[80vh] w-full aspect-video select-none"
              onClick={(e) => e.stopPropagation()}
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
            >
              <Image
                src={fullUrl(selected.assetId)}
                alt={selected.caption || "Wildlife photograph"}
                fill
                sizes="100vw"
                draggable={false}
                unoptimized
                className="object-contain pointer-events-none select-none [-webkit-user-drag:none]"
              />
              <div
                aria-hidden
                className="absolute inset-0"
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
