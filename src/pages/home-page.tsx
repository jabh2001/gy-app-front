import ProductCarousel from "@/components/own/home/product-carousel"
import CarouselWithFooter from "@/components/own/home/hero-carousel"
import { useSettings } from "@/hooks/api"

const IMAGE_BASE = "http://127.0.0.1:5000"

function resolveUrl(url: string): string {
  if (!url) return ""
  if (url.startsWith("http://") || url.startsWith("https://")) return url
  return IMAGE_BASE + url
}

export default function HomePage() {
  const { data: settings } = useSettings()

  const heroImages: string[] = settings?.hero_images?.length
    ? settings.hero_images
    : []

  const bannerImages: string[] = settings?.banner_images?.length
    ? settings.banner_images
    : []

  return (
    <div className="w-full space-y-8 pb-20">
      <section className="relative w-full max-w-[1400px] mx-auto aspect-[16/8] md:aspect-[21/9] mt-4">
        <CarouselWithFooter images={heroImages} />
      </section>

      {bannerImages.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mt-12">
          <div className={`grid gap-6 ${bannerImages.length === 1 ? "grid-cols-1 max-w-2xl mx-auto" : "grid-cols-1 md:grid-cols-2"}`}>
            {bannerImages.map((url, i) => (
              <div key={i} className="rounded-2xl overflow-hidden shadow-xl hover:scale-[1.02] transition-transform cursor-pointer aspect-[16/9]">
                <img
                  src={resolveUrl(url)}
                  alt={`Banner ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 mt-16 text-center">
        <h3 className="text-sm font-bold uppercase tracking-[0.2em] relative inline-block mb-12">
          Recién Llegados
          <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary" />
        </h3>
        <ProductCarousel />
      </section>
    </div>
  )
}
