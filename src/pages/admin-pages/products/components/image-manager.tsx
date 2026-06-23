import { useState, useRef } from "react"
import { GripVertical, Star, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useReorderProductImages } from "@/hooks/api/useProducts"
import type { Product, ProductImage } from "@/api/models"

function resolveUrl(url: string, url_path?: string): string {
  const imgUrl = url_path || url
  if (!imgUrl) return ""
  if (imgUrl.startsWith("http")) return imgUrl
  return "http://127.0.0.1:5000" + imgUrl
}

export default function ImageManager({ product }: { product: Product }) {
  const [images, setImages] = useState<ProductImage[]>(
    [...product.images].sort((a, b) => a.order - b.order)
  )
  const [hasChanges, setHasChanges] = useState(false)
  const dragItem = useRef<number | null>(null)
  const dragOverItem = useRef<number | null>(null)
  const reorderMutation = useReorderProductImages()

  const handleDragStart = (index: number) => {
    dragItem.current = index
  }

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index
  }

  const handleDragEnd = () => {
    if (dragItem.current === null || dragOverItem.current === null) return
    if (dragItem.current === dragOverItem.current) return
    const newImages = [...images]
    const draggedItem = newImages[dragItem.current]
    newImages.splice(dragItem.current, 1)
    newImages.splice(dragOverItem.current, 0, draggedItem)
    setImages(newImages)
    setHasChanges(true)
    dragItem.current = null
    dragOverItem.current = null
  }

  const handleSetMain = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      is_main: i === index,
    }))
    setImages(newImages)
    setHasChanges(true)
  }

  const handleSave = () => {
    const reorderData = images.map((img, i) => ({
      id: img.id,
      order: i,
      is_main: img.is_main,
    }))
    reorderMutation.mutate({ productId: product.id, images: reorderData }, {
      onSuccess: () => setHasChanges(false),
    })
  }

  if (images.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        Este producto no tiene imágenes. Agrégalas desde la pestaña Datos.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Arrastra para reordenar. Haz clic en la estrella para elegir la imagen principal.
        </p>
        {hasChanges && (
          <Button
            size="sm"
            onClick={handleSave}
            disabled={reorderMutation.isLoading}
          >
            <Save size={14} className="mr-1" />
            {reorderMutation.isLoading ? "Guardando..." : "Guardar orden"}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {images.map((img, index) => (
          <div
            key={img.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragEnter={() => handleDragEnter(index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => e.preventDefault()}
            className={`relative group rounded-lg overflow-hidden border-2 transition-colors cursor-grab active:cursor-grabbing ${
              dragItem.current === index ? "opacity-50 border-primary" : "border-transparent hover:border-primary/50"
            }`}
          >
            <img
              src={resolveUrl(img.url, img.url_path)}
              alt={img.alt_text || `Imagen ${index + 1}`}
              className="w-full aspect-square object-cover"
            />

            <div className="absolute top-1 left-1 flex gap-1">
              <button
                type="button"
                onClick={() => handleSetMain(index)}
                className={`p-0.5 rounded-full transition-colors ${
                  img.is_main
                    ? "bg-amber-400 text-white"
                    : "bg-black/40 text-white/60 hover:bg-amber-400/80 hover:text-white"
                }`}
                title={img.is_main ? "Imagen principal" : "Marcar como principal"}
              >
                <Star size={11} className={img.is_main ? "fill-white" : ""} />
              </button>
            </div>

            <div className="absolute top-1 right-1 bg-black/40 rounded p-0.5">
              <GripVertical size={11} className="text-white/80" />
            </div>

            {img.is_main && (
              <span className="absolute bottom-0.5 left-0.5 bg-amber-400 text-black text-[9px] font-bold px-1 py-0 rounded">
                Principal
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
