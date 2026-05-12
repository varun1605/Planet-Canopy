import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { JourneysSection, type Journey } from "@/components/journeys-section"
import { GallerySection, type GalleryPhoto } from "@/components/gallery-section"
import { AboutSection, type Founder } from "@/components/about-section"
import { ReviewsSection, type Review } from "@/components/reviews-section"
import { SightingsSection, type Sighting } from "@/components/sightings-section"
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

const FOUNDERS_QUERY = `*[_type == "founder"] | order(order asc, _createdAt asc){
  _id,
  name,
  role,
  bio,
  instagram,
  linkedin,
  image
}`

// Only approved reviews are surfaced to the public site. Pending ones live in
// Sanity Studio under the Review tab waiting for the owner's approval.
const REVIEWS_QUERY = `*[_type == "review" && approved == true] | order(submittedAt desc, _createdAt desc)[0..19]{
  _id,
  name,
  location,
  rating,
  journey,
  review,
  submittedAt
}`

// Only approved sightings are surfaced. Sorted by most-recent sighting first.
// Show up to 8 on the homepage.
const SIGHTINGS_QUERY = `*[_type == "sighting" && approved == true] | order(sightedAt desc, _createdAt desc)[0..7]{
  _id,
  park,
  zone,
  species,
  individual,
  description,
  sightedAt,
  reportedBy,
  image
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

async function getFounders(): Promise<Founder[] | undefined> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return undefined
  try {
    const docs = await sanityClient.fetch<Array<{
      _id: string
      name: string
      role: string
      bio: string
      instagram?: string
      linkedin?: string
      image: unknown
    }>>(FOUNDERS_QUERY)
    if (!docs || docs.length === 0) return undefined
    return docs.map((d) => ({
      id: d._id,
      name: d.name,
      role: d.role,
      bio: d.bio,
      image: urlFor(d.image as never).width(600).url(),
      instagram: d.instagram,
      linkedin: d.linkedin,
    }))
  } catch {
    return undefined
  }
}

async function getReviews(): Promise<Review[] | undefined> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return undefined
  try {
    const docs = await sanityClient.fetch<Array<{
      _id: string
      name: string
      location?: string
      rating: number
      journey?: string
      review: string
      submittedAt?: string
    }>>(REVIEWS_QUERY)
    if (!docs || docs.length === 0) return undefined
    return docs.map((d) => ({
      id: d._id,
      name: d.name,
      location: d.location,
      rating: d.rating,
      journey: d.journey,
      review: d.review,
      submittedAt: d.submittedAt,
    }))
  } catch {
    return undefined
  }
}

async function getSightings(): Promise<Sighting[] | undefined> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return undefined
  try {
    const docs = await sanityClient.fetch<Array<{
      _id: string
      park: string
      zone?: string
      species: string
      individual?: string
      description: string
      sightedAt: string
      reportedBy?: string
      image?: unknown
    }>>(SIGHTINGS_QUERY)
    if (!docs || docs.length === 0) return undefined
    return docs.map((d) => ({
      id: d._id,
      park: d.park,
      zone: d.zone,
      species: d.species,
      individual: d.individual,
      description: d.description,
      sightedAt: d.sightedAt,
      reportedBy: d.reportedBy,
      imageUrl: d.image ? urlFor(d.image as never).width(900).url() : undefined,
    }))
  } catch {
    return undefined
  }
}

export default async function Home() {
  const [journeys, galleryPhotos, founders, reviews, sightings] = await Promise.all([
    getJourneys(),
    getGalleryPhotos(),
    getFounders(),
    getReviews(),
    getSightings(),
  ])

  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <JourneysSection journeys={journeys} />
      <SightingsSection sightings={sightings} />
      <GallerySection photos={galleryPhotos} />
      <AboutSection founders={founders} />
      <ReviewsSection reviews={reviews} />
      <BookingSection />
      <ContactSection />
    </main>
  )
}
