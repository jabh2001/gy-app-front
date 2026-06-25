import { useState, useRef, useCallback, useEffect } from "react"
import { ImagePlus, X } from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import AdminForm from "./admin-form"
import { NativeImageCheckbox } from "@/components/uitripled/native-image-checkbox-shadcnui"
import { compressImage } from "@/lib/compress-image"

export interface ProductFormData {
  id?: number
  name: string
  sku: string
  price: string
  sale_price: string
  stock: string
  badge: string
  main_image?: string
  is_featured: boolean
  is_on_sale: boolean
  is_active: boolean
  description: string
  images: File[]
  existingImages: string[]
  main_image_index: number
}

interface ProductFormProps {
  data?: ProductFormData
  onSave: (product: FormData) => void
  onEdit: (product: FormData) => void
  onToggleSave?: (payload: Record<string, unknown>) => void
  submitLabel?: string
}

const emptyProductState: ProductFormData = {
  name: "",
  sku: "",
  price: "",
  sale_price: "",
  stock: "",
  badge: "",
  main_image: "",
  is_featured: false,
  is_on_sale: false,
  is_active: false,
  description: "",
  images: [],
  existingImages: [],
  main_image_index: 0,
}

const MAX_IMAGES = 6

export default function ProductForm({ data, onSave, onEdit, onToggleSave, submitLabel = "Guardar producto" }: ProductFormProps) {
  const [formState, setFormState] = useState<ProductFormData>(() =>
    data ? { ...emptyProductState, ...data, images: [] } : emptyProductState
  )
  const [imagePreviews, setImagePreviews] = useState<string[]>(() =>
    data?.images?.map((file) => URL.createObjectURL(file)) ?? []
  )
  const fileInputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()
  const previewsRef = useRef<string[]>(imagePreviews)

  useEffect(() => {
    previewsRef.current = imagePreviews
  }, [imagePreviews])

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      previewsRef.current.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])

  const handleToggle = (key: string, checked: boolean) => {
    setFormState((prev) => ({ ...prev, [key]: checked }))
    if (!data?.id || !onToggleSave) return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      onToggleSave({ [key]: checked })
    }, 800)
  }

  const handleChange = useCallback(
    (key: keyof ProductFormData, value: string | boolean | number) => {
      setFormState((prev) => ({ ...prev, [key]: value }))
    },
    [],
  )

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const newFiles = Array.from(files)
    const remainingSlots = MAX_IMAGES - formState.images.length - formState.existingImages.length
    if (remainingSlots <= 0) {
      toast.error(`Máximo ${MAX_IMAGES} imágenes permitidas.`)
      event.target.value = ""
      return
    }

    const filesToAdd = newFiles.slice(0, remainingSlots)
    const compressed = await Promise.all(filesToAdd.map((file) => compressImage(file)))
    toast.success(`${compressed.length} imagen(es) comprimida(s)`)

    const newPreviews = compressed.map((file) => URL.createObjectURL(file))

    setImagePreviews((prev) => [...prev, ...newPreviews])
    setFormState((prev) => {
      const updatedImages = [...prev.images, ...compressed]
      return {
        ...prev,
        images: updatedImages,
        main_image_index: Math.min(prev.main_image_index, Math.max(updatedImages.length - 1, 0)),
      }
    })

    event.target.value = ""
  }, [formState.images.length, formState.existingImages.length])

  const handleRemove = (index: number) => {
    const preview = imagePreviews[index]
    if (preview) URL.revokeObjectURL(preview)

    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
    setFormState((prev) => {
      const updatedImages = prev.images.filter((_, i) => i !== index)
      return {
        ...prev,
        images: updatedImages,
        main_image_index: Math.min(prev.main_image_index, Math.max(updatedImages.length - 1, 0)),
      }
    })
  }

  const handleSetMainImage = (index: number) => {
    setFormState((prev) => ({ ...prev, main_image_index: index }))
  }

  const buildFormData = useCallback(() => {
    const formData = new FormData()
    if (formState.name) formData.append('name', formState.name)
    if (formState.sku) formData.append('sku', formState.sku)
    if (formState.price) formData.append('price', formState.price)
    if (formState.sale_price) formData.append('sale_price', formState.sale_price)
    if (formState.stock) formData.append('stock', formState.stock)
    if (formState.badge) formData.append('badge', formState.badge)
    formData.append('description', formState.description)
    formData.append('is_featured', formState.is_featured ? 'true' : 'false')
    formData.append('is_on_sale', formState.is_on_sale ? 'true' : 'false')
    formData.append('is_active', formState.is_active ? 'true' : 'false')

    if (formState.images.length > 0) {
      formState.images.forEach((image) => formData.append('images', image))
      formData.append('main_image_index', String(formState.main_image_index))
    } else if (formState.main_image) {
      formData.append('main_image', formState.main_image)
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
    setImagePreviews([])
  }

  const totalImages = formState.images.length + formState.existingImages.length

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
          <Input value={formState.name} onChange={(event) => handleChange('name', event.target.value)} placeholder="Camiseta básica" />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          SKU
          <Input value={formState.sku} onChange={(event) => handleChange('sku', event.target.value)} placeholder="TSHIRT-001" />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Stock
          <Input value={formState.stock} onChange={(event) => handleChange('stock', event.target.value)} placeholder="50" />
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <label className="grid gap-1 text-sm font-medium">
          Precio
          <Input value={formState.price} onChange={(event) => handleChange('price', event.target.value)} placeholder="29.99" />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Precio de oferta
          <Input value={formState.sale_price} onChange={(event) => handleChange('sale_price', event.target.value)} placeholder="19.99" />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Badge
          <Input value={formState.badge} onChange={(event) => handleChange('badge', event.target.value)} placeholder="Nuevo" />
        </label>
      </div>

      <div className="grid gap-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Imágenes del producto</p>
          <span className="text-xs text-muted-foreground">
            {totalImages} / {MAX_IMAGES}
          </span>
        </div>

        <input
          ref={fileInputRef}
          type="file"
           accept=".jpg,.jpeg,.png,.gif,.webp,.bmp"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />

        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
          {formState.images.map((file, index) => (
            <ImagePreview
              key={`new-${file.name}-${index}`}
              src={imagePreviews[index]}
              alt={file.name}
              selected={formState.main_image_index === index}
              setSelected={() => handleSetMainImage(index)}
              onclickRemove={() => handleRemove(index)}
            />
          ))}

          {formState.existingImages.map((url, index) => (
            <ImagePreview
              key={`existing-${index}`}
              src={url}
              alt={`Imagen existente ${index + 1}`}
              selected={false}
              setSelected={() => {}}
              onclickRemove={() => {}}
              readonly
            />
          ))}

          {totalImages < MAX_IMAGES && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="h-40 w-40 flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed transition-colors hover:border-primary hover:bg-primary/5"
            >
              <ImagePlus className="size-6 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Agregar</span>
            </button>
          )}
        </div>

        {formState.images.length > 0 && formState.existingImages.length > 0 && (
          <p className="text-xs text-muted-foreground">
            Las nuevas imágenes reemplazarán a las existentes al guardar.
          </p>
        )}

        {formState.images.length > 1 && (
          <p className="text-xs text-muted-foreground">
            Haz clic en una imagen para marcarla como principal.
          </p>
        )}
      </div>

      <label className="grid gap-1 text-sm font-medium">
        Descripción
        <textarea
          className="min-h-[120px] w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          value={formState.description}
          onChange={(event) => handleChange('description', event.target.value)}
          placeholder="Descripción corta del producto"
        />
      </label>

      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="space-y-0.5">
            <p className="text-sm font-medium">Activo</p>
            <p className="text-xs text-muted-foreground">Visible para los clientes en la tienda.</p>
          </div>
          <Switch checked={formState.is_active} onCheckedChange={(checked) => handleToggle("is_active", checked)} />
        </div>
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="space-y-0.5">
            <p className="text-sm font-medium">Destacado</p>
            <p className="text-xs text-muted-foreground">Aparece en la sección de productos destacados.</p>
          </div>
          <Switch checked={formState.is_featured} onCheckedChange={(checked) => handleToggle("is_featured", checked)} />
        </div>
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="space-y-0.5">
            <p className="text-sm font-medium">En oferta</p>
            <p className="text-xs text-muted-foreground">Muestra el precio de oferta y badge de descuento.</p>
          </div>
          <Switch checked={formState.is_on_sale} onCheckedChange={(checked) => handleToggle("is_on_sale", checked)} />
        </div>
      </div>
    </AdminForm>
  )
}

interface ImagePreviewProps {
  src: string
  alt: string
  selected: boolean
  setSelected: (selected: boolean) => void
  onclickRemove: () => void
  readonly?: boolean
}

function ImagePreview({ src, alt, selected, setSelected, onclickRemove, readonly }: ImagePreviewProps) {
  return (
    <div className="relative aspect-square h-40 w-40">
      {selected && (
        <span className="absolute top-1 z-10 m-auto w-full rounded-b-lg text-center text-xs font-medium text-emerald-500">
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
      {!readonly && (
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute top-1 right-1 size-6"
          onClick={(event) => {
            event.stopPropagation()
            onclickRemove()
          }}
        >
          <X className="size-3" />
        </Button>
      )}
    </div>
  )
}
