import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  FileUpload,
  FileUploadTrigger,
} from "@/components/ui/file-upload"
import { NativeImageCheckbox } from "@/components/uitripled/native-image-checkbox-shadcnui"
import { ImagePlus, X, Plus, Info, Image, Globe, SlidersHorizontal } from "lucide-react"
import { uploadSettingsImage } from "@/api/settings"

const IMAGE_BASE = "http://127.0.0.1:5000"
const MAX_IMAGES = 6

export interface SettingsFormData {
  site_name: string
  site_description: string
  logo_url: string
  contact_email: string
  floating_whatsapp: string
  order_whatsapp: string
  category_max_children: number | string
  category_max_depth: number | string
  hero_images?: string[]
  banner_images?: string[]
  footer_links?: Record<string, string>[]
  social_links?: Record<string, string>[]
}

interface SettingsFormProps {
  data?: SettingsFormData
  onSave: (settings: SettingsFormData) => void
  onEdit: (settings: SettingsFormData) => void
  submitLabel?: string
}

function resolveImageUrl(url: string): string {
  if (!url) return ""
  if (url.startsWith("http://") || url.startsWith("https://")) return url
  return IMAGE_BASE + url
}

/* ──────────── Thumbnail Image (mismo patrón que product-form) ──────────── */

function ThumbImage({
  src,
  alt,
  onclickRemove,
}: {
  src: string
  alt: string
  onclickRemove: () => void
}) {
  return (
    <div className="max-h-40 relative aspect-square">
      <NativeImageCheckbox
        src={src}
        alt={alt}
        className="h-full w-full rounded-lg object-cover"
        selected={false}
        onSelect={() => {}}
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
}

/* ──────────── ImageListManager (patrón FileUpload de productos) ──────────── */

function ImageListManager({
  images,
  onChange,
  label,
}: {
  images: string[]
  onChange: (updated: string[]) => void
  label: string
}) {
  const [uploading, setUploading] = useState(false)

  const handleFileSelect = async (files: File[]) => {
    if (files.length === 0) return
    const remaining = MAX_IMAGES - images.length
    const toUpload = files.slice(0, remaining)
    if (toUpload.length === 0) return

    setUploading(true)
    try {
      const uploadedUrls: string[] = []
      for (const file of toUpload) {
        const url = await uploadSettingsImage(file)
        uploadedUrls.push(url)
      }
      onChange([...images, ...uploadedUrls])
    } catch {
      alert("Error al subir una o más imágenes.")
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = (index: number) => {
    const next = [...images]
    next.splice(index, 1)
    onChange(next)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{label}</p>
        <span className="text-xs text-muted-foreground">{images.length}/{MAX_IMAGES}</span>
      </div>

      <FileUpload
        maxFiles={MAX_IMAGES}
        accept="image/*"
        multiple
        onValueChange={handleFileSelect}
        disabled={uploading || images.length >= MAX_IMAGES}
      >
        <div className="flex flex-wrap gap-2">
          {images.map((url, i) => (
            <ThumbImage
              key={`${url}-${i}`}
              src={resolveImageUrl(url)}
              alt={`${label} ${i + 1}`}
              onclickRemove={() => handleRemove(i)}
            />
          ))}
          {images.length < MAX_IMAGES && (
            <FileUploadTrigger asChild>
              <button className="h-40 w-40 flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed transition-colors hover:border-primary hover:bg-primary/5">
                <ImagePlus className="size-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{uploading ? "Subiendo..." : "Subir"}</span>
              </button>
            </FileUploadTrigger>
          )}
        </div>
      </FileUpload>
    </div>
  )
}

/* ──────────── LogoUpload (mismo patrón FileUpload) ──────────── */

function LogoUpload({
  logoUrl,
  onChange,
}: {
  logoUrl: string
  onChange: (url: string) => void
}) {
  const [uploading, setUploading] = useState(false)

  const handleFileSelect = async (files: File[]) => {
    if (files.length === 0) return
    setUploading(true)
    try {
      const url = await uploadSettingsImage(files[0])
      onChange(url)
    } catch {
      alert("Error al subir el logo.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">Logo</p>
      <FileUpload
        maxFiles={1}
        accept="image/*"
        onValueChange={handleFileSelect}
        disabled={uploading}
      >
        {logoUrl ? (
          <div className="h-40 w-40 relative aspect-square">
            <NativeImageCheckbox
              src={resolveImageUrl(logoUrl)}
              alt="Logo"
              className="h-full w-full rounded-lg object-cover"
              selected={false}
              onSelect={() => {}}
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 size-6"
              onClick={() => onChange("")}
            >
              <X className="size-3" />
            </Button>
          </div>
        ) : (
          <FileUploadTrigger asChild>
            <button className="h-40 w-40 flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed transition-colors hover:border-primary hover:bg-primary/5">
              <ImagePlus className="size-6 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{uploading ? "Subiendo..." : "Subir logo"}</span>
            </button>
          </FileUploadTrigger>
        )}
      </FileUpload>
    </div>
  )
}

/* ──────────── KeyValueListManager ──────────── */

function KeyValueListManager({
  items,
  onChange,
  label,
  keyLabel,
  valueLabel,
  keyPlaceholder,
  valuePlaceholder,
}: {
  items: Record<string, string>[]
  onChange: (updated: Record<string, string>[]) => void
  label: string
  keyLabel: string
  valueLabel: string
  keyPlaceholder: string
  valuePlaceholder: string
}) {
  const keys = Object.keys(items[0] || {})
  const keyField = keys[0] || "name"
  const valueField = keys[1] || "url"

  const handleChange = (index: number, field: string, value: string) => {
    const next = [...items]
    next[index] = { ...next[index], [field]: value }
    onChange(next)
  }

  const handleRemove = (index: number) => {
    const next = [...items]
    next.splice(index, 1)
    onChange(next)
  }

  const handleAdd = () => {
    const entry: Record<string, string> = {}
    entry[keyField] = ""
    entry[valueField] = ""
    onChange([...items, entry])
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{label}</p>
        <Button type="button" variant="outline" size="sm" onClick={handleAdd}>
          <Plus size={14} className="mr-1" /> Agregar
        </Button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2">
          <Input
            placeholder={keyPlaceholder}
            value={item[keyField] || ""}
            onChange={(e) => handleChange(i, keyField, e.target.value)}
            className="flex-1 h-9 text-sm"
          />
          <Input
            type="url"
            placeholder={valuePlaceholder}
            value={item[valueField] || ""}
            onChange={(e) => handleChange(i, valueField, e.target.value)}
            className="flex-[2] h-9 text-sm"
          />
          <Button type="button" variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={() => handleRemove(i)}>
            <X size={14} />
          </Button>
        </div>
      ))}
      {items.length === 0 && (
        <p className="text-xs text-muted-foreground">Sin elementos. Haz clic en "Agregar" para añadir uno.</p>
      )}
    </div>
  )
}

/* ──────────── SocialLinksManager ──────────── */

const SOCIAL_PLATFORMS = [
  "Facebook",
  "Instagram",
  "Twitter",
  "TikTok",
  "YouTube",
  "LinkedIn",
  "WhatsApp",
  "Telegram",
  "GitHub",
  "Discord",
]

function SocialLinksManager({
  items,
  onChange,
}: {
  items: Record<string, string>[]
  onChange: (updated: Record<string, string>[]) => void
}) {
  const keyField = "name"
  const valueField = "url"

  const handleChange = (index: number, field: string, value: string) => {
    const next = [...items]
    next[index] = { ...next[index], [field]: value }
    onChange(next)
  }

  const handleRemove = (index: number) => {
    const next = [...items]
    next.splice(index, 1)
    onChange(next)
  }

  const handleAdd = () => {
    onChange([...items, { [keyField]: "", [valueField]: "" }])
  }

  const usedPlatforms = items.map((item) => item[keyField] || "").filter(Boolean)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Redes Sociales</p>
        <Button type="button" variant="outline" size="sm" onClick={handleAdd}>
          <Plus size={14} className="mr-1" /> Agregar
        </Button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2">
          <Select
            value={item[keyField] || ""}
            onValueChange={(val) => handleChange(i, keyField, val)}
          >
            <SelectTrigger className="flex-1 h-9 text-sm">
              <SelectValue placeholder="Selecciona red" />
            </SelectTrigger>
            <SelectContent>
              {SOCIAL_PLATFORMS.map((platform) => (
                <SelectItem
                  key={platform}
                  value={platform}
                  disabled={usedPlatforms.includes(platform) && item[keyField] !== platform}
                >
                  {platform}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="url"
            placeholder="https://..."
            value={item[valueField] || ""}
            onChange={(e) => handleChange(i, valueField, e.target.value)}
            className="flex-[2] h-9 text-sm"
          />
          <Button type="button" variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={() => handleRemove(i)}>
            <X size={14} />
          </Button>
        </div>
      ))}
      {items.length === 0 && (
        <p className="text-xs text-muted-foreground">Sin redes. Haz clic en "Agregar" para añadir una.</p>
      )}
    </div>
  )
}

/* ──────────── SettingsForm ──────────── */

export default function SettingsForm({ data, onSave, onEdit, submitLabel = "Guardar ajustes" }: SettingsFormProps) {
  const [formState, setFormState] = useState<SettingsFormData>({
    site_name: "Mi Ecommerce",
    site_description: "",
    logo_url: "",
    contact_email: "",
    floating_whatsapp: "",
    order_whatsapp: "",
    category_max_children: "",
    category_max_depth: "",
    hero_images: [],
    banner_images: [],
    footer_links: [],
    social_links: [],
  })

  useEffect(() => {
    if (data) {
      setFormState(data)
    }
  }, [data])

  const handleChange = (key: keyof SettingsFormData, value: string | number) => {
    setFormState((prev) => ({ ...prev, [key]: value }))
  }

  const handleListChange = (key: "hero_images" | "banner_images", value: string[]) => {
    setFormState((prev) => ({ ...prev, [key]: value }))
  }

  const handleMetaListChange = (key: "footer_links" | "social_links", value: Record<string, string>[]) => {
    setFormState((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = () => {
    if (data) {
      onEdit(formState)
      return
    }
    onSave(formState)
  }

  return (
    <Card className="rounded-none">
      <CardHeader>
        <CardTitle>Ajustes del Sitio</CardTitle>
        <p className="text-sm text-muted-foreground">
          Modifica la información general, imágenes, redes sociales y configuración avanzada de tu tienda.
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="datos" className="w-full">
          <TabsList className="w-full justify-start gap-1 rounded bg-muted/50 p-1 h-auto flex-wrap">
            <TabsTrigger value="datos" className="gap-1.5 rounded px-3 py-2 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Info size={15} /> Datos
            </TabsTrigger>
            <TabsTrigger value="imagenes" className="gap-1.5 rounded px-3 py-2 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Image size={15} /> Imágenes
            </TabsTrigger>
            <TabsTrigger value="redes" className="gap-1.5 rounded px-3 py-2 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Globe size={15} /> Redes Sociales
            </TabsTrigger>
            <TabsTrigger value="avanzado" className="gap-1.5 rounded px-3 py-2 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <SlidersHorizontal size={15} /> Avanzado
            </TabsTrigger>
          </TabsList>

          {/* ─── Datos ─── */}
          <TabsContent value="datos" className="mt-4 space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <label className="grid gap-1 text-sm font-medium">
                Nombre del sitio
                <Input value={formState.site_name} onChange={(e) => handleChange("site_name", e.target.value)} placeholder="Mi Ecommerce" required />
              </label>
              <label className="grid gap-1 text-sm font-medium">
                Email de contacto
                <Input type="email" value={formState.contact_email} onChange={(e) => handleChange("contact_email", e.target.value)} placeholder="contacto@miecommerce.com" />
              </label>
            </div>
            <label className="grid gap-1 text-sm font-medium">
              Descripción del sitio
              <Input value={formState.site_description} onChange={(e) => handleChange("site_description", e.target.value)} placeholder="Breve descripción de la tienda..." />
            </label>
            <LogoUpload logoUrl={formState.logo_url} onChange={(url) => handleChange("logo_url", url)} />
            <div className="grid gap-3 md:grid-cols-2">
              <label className="grid gap-1 text-sm font-medium">
                WhatsApp (Botón Flotante)
                <Input value={formState.floating_whatsapp} onChange={(e) => handleChange("floating_whatsapp", e.target.value)} placeholder="+584241234567" />
              </label>
              <label className="grid gap-1 text-sm font-medium">
                WhatsApp (Para Órdenes)
                <Input value={formState.order_whatsapp} onChange={(e) => handleChange("order_whatsapp", e.target.value)} placeholder="+584241234567" />
              </label>
            </div>
          </TabsContent>

          {/* ─── Imágenes ─── */}
          <TabsContent value="imagenes" className="mt-4 space-y-6">
            <ImageListManager
              label="Imágenes del Hero (carrusel principal)"
              images={formState.hero_images || []}
              onChange={(val) => handleListChange("hero_images", val)}
            />
            <ImageListManager
              label="Banners de la página principal"
              images={formState.banner_images || []}
              onChange={(val) => handleListChange("banner_images", val)}
            />
          </TabsContent>

          {/* ─── Redes Sociales ─── */}
          <TabsContent value="redes" className="mt-4 space-y-6">
            <SocialLinksManager
              items={formState.social_links || []}
              onChange={(val) => handleMetaListChange("social_links", val)}
            />
            <KeyValueListManager
              label="Enlaces del Footer"
              items={formState.footer_links || []}
              onChange={(val) => handleMetaListChange("footer_links", val)}
              keyLabel="Texto"
              valueLabel="URL"
              keyPlaceholder="Términos y condiciones"
              valuePlaceholder="https://..."
            />
          </TabsContent>

          {/* ─── Avanzado ─── */}
          <TabsContent value="avanzado" className="mt-4 space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <label className="grid gap-1 text-sm font-medium">
                Subcategorías Máximas (Hijos)
                <Input type="number" value={formState.category_max_children} onChange={(e) => handleChange("category_max_children", e.target.value)} placeholder="Ej: 5" />
              </label>
              <label className="grid gap-1 text-sm font-medium">
                Profundidad Máxima de Categorías
                <Input type="number" value={formState.category_max_depth} onChange={(e) => handleChange("category_max_depth", e.target.value)} placeholder="Ej: 3" />
              </label>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="justify-end">
        <Button onClick={handleSubmit} className="rounded-[8px]">
          {data ? "Actualizar ajustes" : submitLabel}
        </Button>
      </CardFooter>
    </Card>
  )
}
