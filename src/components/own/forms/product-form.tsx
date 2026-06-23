import { useEffect, useState, useCallback, useRef } from "react"
import { ImagePlus, X } from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  FileUpload,
  FileUploadTrigger,
} from "@/components/ui/file-upload"
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
  main_image_index: 0,
}

export default function ProductForm({ data, onSave, onEdit, onToggleSave, submitLabel = "Guardar producto" }: ProductFormProps) {
  const [formState, setFormState] = useState<ProductFormData>(emptyProductState)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()
  const onToggleSaveRef = useRef(onToggleSave)
  onToggleSaveRef.current = onToggleSave
  const dataIdRef = useRef(data?.id)
  dataIdRef.current = data?.id

  useEffect(() => {
    if (data) {
      setFormState((prev) => ({
        ...prev,
        ...data,
        price: data.price ?? prev.price,
        stock: data.stock ?? prev.stock,
        images: [],
        main_image_index: 0,
      }))
    }
  }, [data])

  const handleToggle = (key: string, checked: boolean) => {
    setFormState((prev) => ({ ...prev, [key]: checked }))
    if (!dataIdRef.current || !onToggleSaveRef.current) return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      onToggleSaveRef.current?.({ [key]: checked })
    }, 800)
  }

  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [])

  const handleChange = useCallback(
    (key: keyof ProductFormData, value: string | boolean | number) => {
      setFormState((prev) => ({ ...prev, [key]: value }))
    },
    [],
  )

  const handleImagesChange = useCallback(async (images: File[]) => {
    const compressed = await Promise.all(
      images.map((file) => compressImage(file))
    )
    toast.success(`${compressed.length} imagen(es) comprimida(s)`)
    setFormState((prev) => ({
      ...prev,
      images: compressed,
      main_image_index: Math.min(prev.main_image_index, Math.max(compressed.length - 1, 0)),
    }))
  }, [])

  const handleRemove = (index: number) => {
    setFormState((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      main_image_index: Math.min(prev.main_image_index, Math.max(prev.images.length - 2, 0)),
    }))
  };

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
        <p className="text-sm font-medium">Imágenes del producto</p>
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
                key={index}
                src={URL.createObjectURL(file)}
                alt={file.name}
                selected={formState.main_image_index === index}
                setSelected={() => handleChange('main_image_index', index)}
                onclickRemove={() => handleRemove(index)}
              />
            ))}
            {formState.images.length < 6 && (
              <FileUploadTrigger asChild>
                <button className="h-40 w-40 flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed transition-colors hover:border-primary hover:bg-primary/5">
                  <ImagePlus className="size-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Agregar</span>
                </button>
              </FileUploadTrigger>
            )}
          </div>
        </FileUpload>
        {formState.main_image && !formState.images.length ? (
          <div className="rounded-lg border border-input bg-muted p-3 text-sm text-muted-foreground">
            Imagen existente: {formState.main_image}
          </div>
        ) : null}
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

const Image = ({ src, alt, selected, setSelected, onclickRemove }: { src: string; alt: string; selected: boolean; setSelected: (selected: boolean) => void; onclickRemove: () => void }) => (
  <div className="max-h-40 relative aspect-square">
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
    <Button variant="destructive" size="icon" className="absolute top-1 right-1 size-6" onClick={onclickRemove}>
      <X className="size-3" />
    </Button>
  </div>
)
