import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { ProductCard } from "../product-card";
import { useProducts } from "@/hooks/api";
import { useEffect } from "react";


export default function ProductCarousel() {
  const { data } = useProducts({ active: true, featured: true })
  useEffect(() => {
    console.log("Productos destacados:", data)
  }, [data])
  return (
    <Carousel
      className="w-3/4 m-auto"
      opts={{
        align: "start",
      }}
    >
      <CarouselContent className="-ml-2">
        {data?.items?.map((p) => (
            <CarouselItem key={p.id} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <ProductCard
                    product={{ 
                        id:p.id, 
                        name:p.name, 
                        image:p.main_image_url_path ?? undefined, 
                        price:p.price
                    }} 
                />
            </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
