import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { ProductCard } from "../product-card";

const images = [
  "https://www.fffuel.co/images/dddepth-preview/dddepth-248.jpg",
  "https://www.fffuel.co/images/dddepth-preview/dddepth-051.jpg",
  "https://www.fffuel.co/images/dddepth-preview/dddepth-029.jpg",
  "https://www.fffuel.co/images/dddepth-preview/dddepth-038.jpg",
  "https://www.fffuel.co/images/dddepth-preview/dddepth-012.jpg",
];

export default function ProductCarousel() {
  return (
    <Carousel
      className="w-3/4 m-auto"
      opts={{
        align: "start",
      }}
    >
      <CarouselContent className="-ml-2">
        {[1,2,3,4,5].map((i, j) => (
            <CarouselItem key={i} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <ProductCard
                    product={{ 
                        id:i, 
                        name:"Power Cable | PC/Monitor UK 3-Pin 3M", 
                        // image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=60&w=400", 
                        image:images[j], 
                        price:8.99*(0.5*i)
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
