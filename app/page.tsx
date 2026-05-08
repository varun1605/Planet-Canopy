import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { JourneysSection, type Journey } from "@/components/journeys-section"
import { GallerySection, type GalleryPhoto } from "@/components/gallery-section"
import { AboutSection } from "@/components/about-section"
import { ReviewsSection } from "@/components/reviews-section"
import { BookingSection } from "@/components/booking-section"
import { ContactSection } from "@/components/contact-section"
import { sanityClient, urlFor } from "@/lib/sanity"

const JOURNEYS_QUERY = `*[_type == "journey"] | order(order asc, _createdAt asc){
  _id,
  title,
  location,
  duration,
  date,
  description,
  price,
  highlights,
  image
}`

const GALLERY_QUERY = `*[_type == "galleryPhoto"] | order(order asc, _createdAt asc){
  _id,
  caption,
  "assetId": image.asset->_id
}`

export const revalidate = 60

async function getJourneys(): Promise<Journey[] | undefined> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return undefined
  try {
    const docs = await sanityClient.fetch<Array<{
      _id: string
      title: string
      location: string
      duration?: string
      date?: string
      description: string
      price?: string
      highlights?: string[]
      image: unknown
    }>>(JOURNEYS_QUERY)
    if (!docs || docs.length === 0) return undefined
    return docs.map((d) => ({
      id: d._id,
      title: d.title,
      location: d.location,
      duration: d.duration ?? "",
      date: d.date ?? "",
      description: d.description,
      price: d.price ?? "",
      highlights: d.highlights ?? [],
      image: urlFor(d.image as never).width(1200).url(),
    }))
  } catch {
    return undefined
  }
}

async function getGalleryPhotos(): Promise<GalleryPhoto[] | undefined> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return undefined
  try {
    const docs = await sanityClient.fetch<Array<{
      _id: string
      caption?: string
      assetId?: string
    }>>(GALLERY_QUERY)
    if (!docs || docs.length === 0) return undefined
    return docs
      .filter((d) => !!d.assetId)
      .map((d) => ({
        id: d._id,
        assetId: d.assetId as string,
        caption: d.caption,
      }))
  } catch {
    return undefined
  }
}

export default async function Home() {
  const [journeys, galleryPhotos] = await Promise.all([
    getJourneys(),
    getGalleryPhotos(),
  ])

  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <JourneysSection journeys={journeys} />
      <GallerySection photos={galleryPhotos} />
      <AboutSection />
      <ReviewsSection />
      <BookingSection />
      <ContactSection />
    </main>
  )
}
