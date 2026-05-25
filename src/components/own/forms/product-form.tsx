import { useEffect, useState, useCallback } from "react"
import { ImagePlus, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
// import {
//   FileUpload,
//   FileUploadTrigger,
// } from "@/components/ui/file-upload"
import AdminForm from "./admin-form"
import { NativeImageCheckbox } from "@/components/uitripled/native-image-checkbox-shadcnui"

export interface ProductFormData {
  id?: number
  name: string
  sku: string
  price: string
  sale_price: string
  stock: string
  badge: string
  mainImage?: string
  isFeatured: boolean
  isOnSale: boolean
  isActive: boolean
  description: string
  images: File[]
  mainImageIndex: number
}

interface ProductFormProps {
  data?: ProductFormData
  onSave: (product: FormData) => void
  onEdit: (product: FormData) => void
  submitLabel?: string
}

const emptyProductState: ProductFormData = {
  name: "",
  sku: "",
  price: "",
  sale_price: "",
  stock: "",
  badge: "",
  mainImage: "",
  isFeatured: false,
  isOnSale: false,
  isActive: false,
  description: "",
  images: [],
  mainImageIndex: 0,
}

export default function ProductForm({ data, onSave, onEdit, submitLabel = "Guardar producto" }: ProductFormProps) {
  const [formState, setFormState] = useState<ProductFormData>(emptyProductState)

  useEffect(() => {
    if (data) {
      setFormState((prev) => ({
        ...prev,
        ...data,
        price: data.price ?? prev.price,
        stock: data.stock ?? prev.stock,
        images: [],
        mainImageIndex: 0,
      }))
    }
  }, [data])

  const handleChange = useCallback(
    (key: keyof ProductFormData, value: string | boolean | number) => {
      setFormState((prev) => ({ ...prev, [key]: value }))
    },
    [],
  )

  // const handleImagesChange = useCallback((images: File[]) => {
  //   console.log("Selected images:", images)
  //   setFormState((prev) => ({
  //     ...prev,
  //     images,
  //     mainImageIndex: Math.min(prev.mainImageIndex, Math.max(images.length - 1, 0)),
  //   }))
  // }, [])

  // const handleRemove = (index: number) => {
  //   setFormState((prev) => ({
  //     ...prev,
  //     images: prev.images.filter((_, i) => i !== index),
  //     mainImageIndex: Math.min(prev.mainImageIndex, Math.max(prev.images.length - 2, 0)),
  //   }))
  // };

  const buildFormData = useCallback(() => {
    const formData = new FormData()
    formData.append('name', formState.name)
    formData.append('sku', formState.sku)
    formData.append('price', formState.price)
    formData.append('sale_price', formState.sale_price)
    formData.append('stock', formState.stock)
    formData.append('badge', formState.badge)
    formData.append('description', formState.description)
    formData.append('is_featured', formState.isFeatured ? 'true' : 'false')
    formData.append('is_on_sale', formState.isOnSale ? 'true' : 'false')
    formData.append('is_active', formState.isActive ? 'true' : 'false')

    if (formState.images.length > 0) {
      formState.images.forEach((image) => formData.append('images', image))
      formData.append('main_image_index', String(formState.mainImageIndex))
    } else if (formState.mainImage) {
      formData.append('main_image', formState.mainImage)
    }

    return formData
  }, [formState])

  const handleSubmit = () => {
    const payload = buildFormData()

    if (data?.id) {
      onEdit(payload)
      return
    }

    onSave(payload)
    setFormState(emptyProductState)
  }

  return (
    <AdminForm
      title={data ? "Editar producto" : "Nuevo producto"}
      description="Define los datos básicos del producto y guarda los cambios."
      submitLabel={submitLabel}
      submitLabelOnEdit="Actualizar producto"
      isEditing={Boolean(data)}
      onSubmit={handleSubmit}
    >
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        <label className="grid gap-1 text-sm font-medium">
          Nombre
          <Input
            value={formState.name}
            onChange={(event) => handleChange('name', event.target.value)}
            placeholder="Camiseta básica"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          SKU
          <Input
            value={formState.sku}
            onChange={(event) => handleChange('sku', event.target.value)}
            placeholder="TSHIRT-001"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Stock
          <Input
            value={formState.stock}
            onChange={(event) => handleChange('stock', event.target.value)}
            placeholder="50"
          />
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <label className="grid gap-1 text-sm font-medium">
          Precio
          <Input
            value={formState.price}
            onChange={(event) => handleChange('price', event.target.value)}
            placeholder="29.99"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Precio de oferta
          <Input
            value={formState.sale_price}
            onChange={(event) => handleChange('sale_price', event.target.value)}
            placeholder="29.99"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Badge
          <Input
            value={formState.badge}
            onChange={(event) => handleChange('badge', event.target.value)}
            placeholder="Nuevo"
          />
        </label>
      </div>
{/* 
      <div className="grid gap-3">
        Imágenes del producto
        <FileUpload
          maxFiles={6}
          accept="image/*"
          multiple
          value={formState.images}
          onValueChange={handleImagesChange}
          onClick={(event) => { event.stopPropagation() }}
        >
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {formState.images.map((file, index) => (
              <Image
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  selected={formState.mainImageIndex === index}
                  setSelected={() => handleChange('mainImageIndex', index)}
                  onclickRemove={() => handleRemove(index)}
              />
            ))}
            {formState.images.length < 6 && (
              <FileUploadTrigger asChild>
                <button className="h-40 w-40 flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed transition-colors hover:border-primary hover:bg-primary/5">
                  <ImagePlus className="size-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Add</span>
                </button>
              </FileUploadTrigger>
            )}
          </div>

        </FileUpload>
        {formState.mainImage && !formState.images.length ? (
          <div className="rounded-lg border border-input bg-muted p-3 text-sm text-muted-foreground">
            Imagen existente: {formState.mainImage}
          </div>
        ) : null}
      </div> */}

      <label className="grid gap-1 text-sm font-medium">
        Descripción
        <textarea
          className="min-h-[120px] w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          value={formState.description}
          onChange={(event) => handleChange('description', event.target.value)}
          placeholder="Descripción corta del producto"
        />
      </label>

      <div className="grid gap-3 md:grid-cols-3">
        <label className="inline-flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={formState.isActive}
            onChange={(event) => handleChange('isActive', event.target.checked)}
            className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
          />
          Activo
        </label>
        <label className="inline-flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={formState.isFeatured}
            onChange={(event) => handleChange('isFeatured', event.target.checked)}
            className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
          />
          Destacado
        </label>
        <label className="inline-flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={formState.isOnSale}
            onChange={(event) => handleChange('isOnSale', event.target.checked)}
            className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
          />
          Poner en oferta
        </label>
      </div>
    </AdminForm>
  )
}

const Image = ({ src, alt, selected, setSelected, onclickRemove }: { src: string; alt: string; selected: boolean; setSelected: (selected: boolean) => void; onclickRemove: () => void }) => (
  <div className="max-h-40 relative aspect-square">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    {selected && (
      <span className="absolute top-1 w-full m-auto text-center text-xs font-medium text-emerald-500 rounded-b-lg z-10">
        Imagen principal
      </span>
    )}
    <NativeImageCheckbox
      src={src}
      alt={alt}
      className="h-full w-full rounded-lg object-cover"
      selected={selected}
      onSelect={setSelected}
    />
    <Button
      variant="destructive"
      size="icon"
      className="absolute top-1 right-1 size-6"
      onClick={onclickRemove}
    >
      <X className="size-3" />
    </Button>
  </div>
)