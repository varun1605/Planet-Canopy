"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"

const galleryImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1535941339077-2dd1c7963098?w=800&q=80",
    alt: "Royal Bengal Tiger in natural habitat",
    category: "Tiger",
    span: "col-span-2 row-span-2",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800&q=80",
    alt: "Elephant family crossing river",
    category: "Elephant",
    span: "col-span-1 row-span-1",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=800&q=80",
    alt: "Leopard resting on tree branch",
    category: "Leopard",
    span: "col-span-1 row-span-1",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=800&q=80",
    alt: "Peacock displaying feathers",
    category: "Birds",
    span: "col-span-1 row-span-1",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1581852017103-68ac65514cf7?w=800&q=80",
    alt: "One-horned Rhino in grasslands",
    category: "Rhino",
    span: "col-span-1 row-span-2",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1504173010664-32509aeebb62?w=800&q=80",
    alt: "Safari jeep on dusty trail",
    category: "Safari",
    span: "col-span-2 row-span-1",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
    alt: "Wild deer in morning mist",
    category: "Deer",
    span: "col-span-1 row-span-1",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1615824996195-f780bba7cfab?w=800&q=80",
    alt: "Tiger crossing water stream",
    category: "Tiger",
    span: "col-span-1 row-span-1",
  },
]

export function GallerySection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null)

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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
          {galleryImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative group cursor-pointer overflow-hidden rounded-sm ${image.span}`}
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-all duration-300" />
              
              {/* Overlay Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-primary-foreground font-[var(--font-outfit)] text-xs tracking-widest uppercase mb-1">
                  {image.category}
                </span>
                <p className="text-primary-foreground font-medium text-sm line-clamp-2">{image.alt}</p>
              </div>
            </motion.div>
          ))}
        </div>

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

      {/* Lightbox */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/90 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-primary-foreground hover:text-primary-foreground/80 transition-colors"
            onClick={() => setSelectedImage(null)}
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8" />
          </button>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative max-w-5xl max-h-[80vh] w-full aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage.src}
              alt={selectedImage.alt}
              fill
              className="object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-foreground/80 to-transparent">
              <span className="text-primary-foreground/80 font-[var(--font-outfit)] text-sm tracking-widest uppercase">
                {selectedImage.category}
              </span>
              <p className="text-primary-foreground text-xl font-medium mt-1">{selectedImage.alt}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}
