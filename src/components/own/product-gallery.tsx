import { useState } from 'react';
import { MultiHostImage } from "@/components/own/multi-host-image"

export function ProductGallery({ images }: { images: string[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex gap-4">
      {/* Miniaturas Verticales a la izquierda */}
      <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto">
        {images.map((url, index) => (
          <button
            key={index}
            className={`w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
              activeIndex === index ? 'border-yellow-400' : 'border-gray-200 hover:border-gray-400'
            }`}
            onClick={() => setActiveIndex(index)}
          >
            <MultiHostImage path={url} className="w-full h-full object-cover" alt="miniatura" />
          </button>
        ))}
      </div>

      {/* Imagen Principal en el centro */}
      <div className="relative flex-1 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center min-h-[500px]">
        <MultiHostImage path={images[activeIndex]} className="max-h-[500px] object-contain" alt="producto" />
        
        {/* Aquí irían tus botones flotantes de flecha izquierda/derecha si los deseas */}
      </div>
    </div>
  );
}