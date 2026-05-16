import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

export default function CarouselWithFooter() {

  return (
    <div className="mx-auto py-4 md:w-3/4">
      <Carousel
        plugins={[
            Autoplay({ delay:5000 })
        ]}
      >
        <CarouselContent>
            <CarouselItem>
                <img 
                    src="https://files.elfsightcdn.com/eafe4a4d-3436-495d-b748-5bdce62d911d/de252012-da11-4da5-846d-3d2d1ed7750d/91.png" 
                    alt="Wireless Headphones" 
                    className="object-contain w-full"
                />
            </CarouselItem>
            <CarouselItem>
                <img 
                    src="https://files.elfsightcdn.com/eafe4a4d-3436-495d-b748-5bdce62d911d/b1320909-15e1-4c9b-9b8d-0de13a3f6c13/89.png" 
                    alt="Wireless Headphones" 
                    className="object-contain w-full"
                />
            </CarouselItem>
            <CarouselItem>
                <img 
                    src="https://files.elfsightcdn.com/eafe4a4d-3436-495d-b748-5bdce62d911d/a7ae3c94-5813-4798-9383-627df8a8c4bc/92.png" 
                    alt="Wireless Headphones" 
                    className="object-contain w-full"
                />
            </CarouselItem>
            <CarouselItem>
                <img 
                    src="https://files.elfsightcdn.com/eafe4a4d-3436-495d-b748-5bdce62d911d/1d97f2b3-ba6e-4041-89f2-706246f833cf/90.png"
                    alt="Wireless Headphones" 
                    className="object-contain w-full"
                />
            </CarouselItem>
        </CarouselContent>
        <CarouselPrevious variant="default" className="left-2 md:-left-12" />
        <CarouselNext variant="default" className="right-2 md:-right-12" />
      </Carousel>
    </div>
  );
}
