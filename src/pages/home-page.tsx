import ProductCarousel from "@/components/own/home/product-carousel";
import CarouselWithFooter from "@/components/own/home/hero-carousel";

export default function HomePage() {
  return (
    <div className="w-full space-y-8 pb-20">
      
      {/* Hero Slider Section (Ref: image_803437.png) */}
      <section className="relative w-full max-w-[1400px] mx-auto aspect-[16/8] md:aspect-[21/9] mt-4">
        <CarouselWithFooter />
      </section>

      {/* Banners Secundarios (Ref: image_4.png) */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        <div className="rounded-2xl overflow-hidden shadow-xl hover:scale-[1.02] transition-transform cursor-pointer">
          <img src="https://files.elfsightcdn.com/eafe4a4d-3436-495d-b748-5bdce62d911d/de252012-da11-4da5-846d-3d2d1ed7750d/91.png"  alt="Waterproof Case" className="w-full h-full object-cover" />
        </div>
        <div className="rounded-2xl overflow-hidden shadow-xl hover:scale-[1.02] transition-transform cursor-pointer">
          <img src="https://files.elfsightcdn.com/eafe4a4d-3436-495d-b748-5bdce62d911d/b1320909-15e1-4c9b-9b8d-0de13a3f6c13/89.png"  alt="Enjoy Life with Pixma" className="w-full h-full object-cover" />
        </div>
      </section>

      {/* Banner Ancho (Ref: Galaxy S26 Ultra de image_4.png) */}
      <section className="max-w-7xl mx-auto px-4 mt-6">
        <div className="rounded-2xl overflow-hidden shadow-xl relative group cursor-pointer">
          <img src="https://files.elfsightcdn.com/eafe4a4d-3436-495d-b748-5bdce62d911d/a7ae3c94-5813-4798-9383-627df8a8c4bc/92.png"  alt="Galaxy S26 Ultra" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-transparent"></div>
        </div>
      </section>

      {/* Sección "Newly Arrived" */}
      <section className="max-w-7xl mx-auto px-4 mt-16 text-center">
        <h3 className="text-sm font-bold uppercase tracking-[0.2em] relative inline-block mb-12">
          Newly Arrived
          <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary"></span>
        </h3>
        
        <ProductCarousel />
      </section>
    </div>
  );
}