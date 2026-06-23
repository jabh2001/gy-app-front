import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

const IMAGE_BASE = "http://127.0.0.1:5000"

function resolveUrl(url: string): string {
  if (!url) return ""
  if (url.startsWith("http://") || url.startsWith("https://")) return url
  return IMAGE_BASE + url
}

interface CarouselWithFooterProps {
  images: string[]
}

export default function CarouselWithFooter({ images }: CarouselWithFooterProps) {
  if (!images || images.length === 0) {
    return (
      <div className="mx-auto py-4 md:w-3/4 flex items-center justify-center h-48 bg-muted rounded-xl text-muted-foreground text-sm">
        Sin imágenes del hero configuradas
      </div>
    )
  }

  return (
    <div className="mx-auto py-4 md:w-3/4">
      <Carousel plugins={[Autoplay({ delay: 5000 })]}>
        <CarouselContent>
          {images.map((url, i) => (
            <CarouselItem key={i} className="aspect-[16/8] md:aspect-[21/9]">
              <img
                src={resolveUrl(url)}
                alt={`Hero ${i + 1}`}
                className="object-cover w-full h-full rounded-xl"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious variant="default" className="left-2 md:-left-12" />
        <CarouselNext variant="default" className="right-2 md:-right-12" />
      </Carousel>
    </div>
  )
}
