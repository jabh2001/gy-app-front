import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { ProductCard } from "../product-card";
import { useProducts } from "@/hooks/api";
import Autoplay from "embla-carousel-autoplay"


export default function ProductCarousel() {
  const { data } = useProducts({ active: true, featured: true })
  return (
    <Carousel
      className="w-full m-auto"
      opts={{
        align: "start",
      }}
      plugins={[Autoplay({ delay: 2500 })]}
    >
      <CarouselContent className="-ml-2">
        {data?.items?.map((p) => (
            <CarouselItem key={p.id} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/6">
                <ProductCard
                    to={`/shop/product/${p.id}`}
                    product={{ 
                        id:p.id, 
                        name:p.name, 
                        image:p.main_image ?? undefined, 
                        price:p.price
                    }} 
                />
            </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2 xl:-left-12" />
      <CarouselNext className="right-2 xl:-right-12" />
    </Carousel>
  );
}
