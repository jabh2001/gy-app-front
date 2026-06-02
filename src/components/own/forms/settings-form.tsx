import { useEffect, useState, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { FileUpload, FileUploadTrigger } from "@/components/ui/file-upload"
import { ImagePlus, X } from "lucide-react"
import SocialMediaIcon, { SOCIAL_PLATFORMS } from "../SocialMediaIcon"
import { NativeImageCheckbox } from "@/components/uitripled/native-image-checkbox-shadcnui"

// Interfaz actualizada para coincidir con el modelo SQLAlchemy
export interface SettingsFormData {
  site_name: string
  site_description: string
  logo_url: string
  contact_email: string
  floating_whatsapp: string
  order_whatsapp: string
  category_max_children: number | string
  category_max_depth: number | string
  hero_images?: string[] // URLs existentes que vienen de la BD
  footer_links?: Record<string, string>[]
  social_links?: Record<string, string>[]
}

interface SettingsFormProps {
  data?: SettingsFormData
  onSave: (payload: FormData) => void
  onEdit: (payload: FormData) => void
  submitLabel?: string
  isSaving?: boolean
}

/* ─── ícono WhatsApp inline ─── */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

/* ─── Preview de imagen con fallback ─── */
function ImagePreview({ url, alt, size = "md" }: { url: string; alt: string; size?: "sm" | "md" | "lg" }) {
  const [error, setError] = useState(false)
  useEffect(() => { setError(false) }, [url])

  const sizeClasses = {
    sm: "h-16 w-16",
    md: "h-24 w-24",
    lg: "h-32 w-full max-w-xs",
  }

  if (!url || error) {
    return (
      <div className={`${sizeClasses[size]} rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center`}>
        <svg className="size-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
        </svg>
      </div>
    )
  }

  return (
    <img
      src={url}
      alt={alt}
      className={`${sizeClasses[size]} rounded-xl border border-slate-200 object-cover`}
      onError={() => setError(true)}
    />
  )
}

const ImageItem = ({ src, alt, onclickRemove }: { src: string; alt: string; onclickRemove: () => void }) => (
  <div className="h-40 w-40 relative aspect-square">
    <img
      src={src}
      alt={alt}
      className="h-full w-full rounded-lg object-cover border border-slate-200"
    />
    <Button
      type="button"
      variant="destructive"
      size="icon"
      className="absolute top-1 right-1 size-6 opacity-80 hover:opacity-100"
      onClick={onclickRemove}
    >
      <X className="size-3" />
    </Button>
  </div>
)

/* ─── Sección Card reutilizable ─── */
function SettingsSection({ title, description, icon, children }: {
  title: string
  description: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <Card className="border-slate-200/80 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 text-slate-600">
            {icon}
          </div>
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-5">{children}</CardContent>
    </Card>
  )
}

export default function SettingsForm({ data, onSave, onEdit, submitLabel = "Guardar ajustes", isSaving }: SettingsFormProps) {
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
    footer_links: [],
    social_links: []
  })

  // Estado para nuevos archivos de imágenes
  const [newHeroImages, setNewHeroImages] = useState<File[]>([])

  useEffect(() => {
    if (data) {
      setFormState(data)
      setNewHeroImages([]) // Resetear archivos nuevos al cargar data
    }
  }, [data])

  const handleChange = (key: keyof SettingsFormData, value: string | number) => {
    setFormState((prev) => ({ ...prev, [key]: value }))
  }

  const buildFormData = useCallback(() => {
    const formData = new FormData()
    formData.append('site_name', formState.site_name)
    formData.append('site_description', formState.site_description)
    formData.append('logo_url', formState.logo_url)
    formData.append('contact_email', formState.contact_email)
    formData.append('floating_whatsapp', formState.floating_whatsapp)
    formData.append('order_whatsapp', formState.order_whatsapp)
    formData.append('category_max_children', String(formState.category_max_children))
    formData.append('category_max_depth', String(formState.category_max_depth))

    if (formState.social_links) {
      formData.append('social_links', JSON.stringify(formState.social_links))
    }
    if (formState.footer_links) {
      formData.append('footer_links', JSON.stringify(formState.footer_links))
    }

    if (formState.hero_images) {
      formState.hero_images.forEach((url) => {
        formData.append('existing_hero_images', url)
      })
    }

    if (newHeroImages.length > 0) {
      newHeroImages.forEach((image) => {
        formData.append('hero_images', image)
      })
    } else if (!formState.hero_images || formState.hero_images.length === 0) {
      // Evitar que falle si enviamos vacío y no pasamos existing
      formData.append('existing_hero_images', '')
    }

    return formData
  }, [formState, newHeroImages])

  const handleSubmit = () => {
    const payload = buildFormData()
    if (data) {
      onEdit(payload)
      return
    }
    onSave(payload)
  }

  /* ─── Hero images helpers ─── */
  const handleNewImagesChange = useCallback((images: File[]) => {
    setNewHeroImages(images)
  }, [])

  const removeExistingHeroImage = (idx: number) => {
    setFormState((prev) => ({
      ...prev,
      hero_images: (prev.hero_images ?? []).filter((_, i) => i !== idx)
    }))
  }

  const removeNewHeroImage = (idx: number) => {
    setNewHeroImages(prev => prev.filter((_, i) => i !== idx))
  }

  /* ─── Social links helpers ─── */
  const socialLinks = formState.social_links ?? []
  const addSocialLink = () => {
    setFormState((prev) => ({
      ...prev,
      social_links: [...(prev.social_links ?? []), { platform: "instagram", url: "" }]
    }))
  }
  const updateSocialLink = (idx: number, field: string, value: string) => {
    setFormState((prev) => {
      const updated = [...(prev.social_links ?? [])]
      updated[idx] = { ...updated[idx], [field]: value }
      return { ...prev, social_links: updated }
    })
  }
  const removeSocialLink = (idx: number) => {
    setFormState((prev) => ({
      ...prev,
      social_links: (prev.social_links ?? []).filter((_, i) => i !== idx)
    }))
  }

  /* ─── Footer links helpers ─── */
  const footerLinks = formState.footer_links ?? []
  const addFooterLink = () => {
    setFormState((prev) => ({
      ...prev,
      footer_links: [...(prev.footer_links ?? []), { label: "", url: "" }]
    }))
  }
  const updateFooterLink = (idx: number, field: string, value: string) => {
    setFormState((prev) => {
      const updated = [...(prev.footer_links ?? [])]
      updated[idx] = { ...updated[idx], [field]: value }
      return { ...prev, footer_links: updated }
    })
  }
  const removeFooterLink = (idx: number) => {
    setFormState((prev) => ({
      ...prev,
      footer_links: (prev.footer_links ?? []).filter((_, i) => i !== idx)
    }))
  }

  /* ─── Iconos para tabs ─── */
  const icons = {
    general: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a1.494 1.494 0 0 1-.327-1.016A1.5 1.5 0 0 1 4.887 7.5h14.226a1.5 1.5 0 0 1 1.464 1.833 1.494 1.494 0 0 1-.327 1.016m-16.5 0h16.5" />
      </svg>
    ),
    images: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
      </svg>
    ),
    whatsapp: <WhatsAppIcon className="size-4" />,
    social: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
      </svg>
    ),
    footer: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
      </svg>
    ),
    advanced: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    ),
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="w-full flex-wrap h-auto gap-1 bg-slate-100/80 p-1 rounded-xl">
          <TabsTrigger value="general" className="gap-1.5 rounded-lg text-xs sm:text-sm">
            {icons.general} General
          </TabsTrigger>
          <TabsTrigger value="images" className="gap-1.5 rounded-lg text-xs sm:text-sm">
            {icons.images} Imágenes
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="gap-1.5 rounded-lg text-xs sm:text-sm">
            {icons.whatsapp} WhatsApp
          </TabsTrigger>
          <TabsTrigger value="social" className="gap-1.5 rounded-lg text-xs sm:text-sm">
            {icons.social} Redes
          </TabsTrigger>
          <TabsTrigger value="footer" className="gap-1.5 rounded-lg text-xs sm:text-sm">
            {icons.footer} Footer
          </TabsTrigger>
          <TabsTrigger value="advanced" className="gap-1.5 rounded-lg text-xs sm:text-sm">
            {icons.advanced} Avanzado
          </TabsTrigger>
        </TabsList>

        {/* ─── TAB: General ─── */}
        <TabsContent value="general">
          <SettingsSection
            title="Información General"
            description="Datos básicos del sitio y contacto principal."
            icon={icons.general}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-1.5 text-sm font-medium">
                Nombre del sitio
                <Input
                  value={formState.site_name}
                  onChange={(e) => handleChange("site_name", e.target.value)}
                  placeholder="Mi Ecommerce"
                  required
                />
                <span className="text-xs text-muted-foreground">El nombre que aparecerá en toda tu tienda.</span>
              </label>
              <label className="grid gap-1.5 text-sm font-medium">
                Email de contacto
                <Input
                  type="email"
                  value={formState.contact_email}
                  onChange={(e) => handleChange("contact_email", e.target.value)}
                  placeholder="contacto@miecommerce.com"
                />
                <span className="text-xs text-muted-foreground">Email principal para recibir consultas.</span>
              </label>
            </div>
            <label className="grid gap-1.5 text-sm font-medium">
              Descripción del sitio
              <Input
                value={formState.site_description}
                onChange={(e) => handleChange("site_description", e.target.value)}
                placeholder="Breve descripción de la tienda..."
              />
              <span className="text-xs text-muted-foreground">Se usa en SEO y en la meta descripción del sitio.</span>
            </label>
          </SettingsSection>
        </TabsContent>

        {/* ─── TAB: Imágenes ─── */}
        <TabsContent value="images">
          <SettingsSection
            title="Imágenes del Sitio"
            description="Configura el logo y las imágenes del banner principal (hero)."
            icon={icons.images}
          >
            {/* Logo */}
            <div className="space-y-3">
              <p className="text-sm font-medium">Logo del sitio</p>
              <div className="flex items-start gap-4">
                <ImagePreview url={formState.logo_url} alt="Logo del sitio" size="md" />
                <label className="grid flex-1 gap-1.5 text-sm">
                  URL del logo
                  <Input
                    type="url"
                    value={formState.logo_url}
                    onChange={(e) => handleChange("logo_url", e.target.value)}
                    placeholder="https://ejemplo.com/logo.png"
                  />
                  <span className="text-xs text-muted-foreground">URL directa a la imagen del logo. Formatos: PNG, JPG, SVG, WebP.</span>
                </label>
              </div>
            </div>

            <Separator />

            {/* Hero Images */}
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium">Imágenes del Hero (Banner)</p>
                <p className="text-xs text-muted-foreground mb-4">Sube las imágenes que se mostrarán en el carrusel principal de la tienda. Puedes subir múltiples imágenes.</p>
              </div>

              <FileUpload
                maxFiles={6}
                accept="image/*"
                multiple
                value={newHeroImages}
                onValueChange={handleNewImagesChange}
                onClick={(event) => { event.stopPropagation() }}
              >
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  {/* Imágenes existentes (URLs) */}
                  {formState.hero_images?.map((url, idx) => (
                    <ImageItem
                      key={`existing-${idx}`}
                      src={url}
                      alt={`Hero ${idx + 1}`}
                      onclickRemove={() => removeExistingHeroImage(idx)}
                    />
                  ))}

                  {/* Imágenes nuevas (Files) */}
                  {newHeroImages.map((file, idx) => (
                    <ImageItem
                      key={`new-${idx}`}
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      onclickRemove={() => removeNewHeroImage(idx)}
                    />
                  ))}

                  {/* Botón de upload */}
                  {((formState.hero_images?.length ?? 0) + newHeroImages.length) < 6 && (
                    <FileUploadTrigger asChild>
                      <button className="h-40 w-40 flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-slate-300 transition-colors hover:border-slate-400 hover:bg-slate-50">
                        <ImagePlus className="size-6 text-slate-400" />
                        <span className="text-xs text-slate-500 font-medium">Agregar</span>
                      </button>
                    </FileUploadTrigger>
                  )}
                </div>
              </FileUpload>
            </div>
          </SettingsSection>
        </TabsContent>

        {/* ─── TAB: WhatsApp ─── */}
        <TabsContent value="whatsapp">
          <SettingsSection
            title="Configuración de WhatsApp"
            description="Configura los números de WhatsApp para diferentes funciones de tu tienda."
            icon={icons.whatsapp}
          >
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                  </svg>
                </div>
                <div className="text-sm text-emerald-800">
                  <p className="font-medium">¿Cuál es la diferencia?</p>
                  <p className="mt-1 text-emerald-700">
                    <strong>Botón Flotante:</strong> es el botón de WhatsApp que aparece en todas las páginas de la tienda para consultas generales de los clientes.
                  </p>
                  <p className="mt-1 text-emerald-700">
                    <strong>WhatsApp de Órdenes:</strong> es el número al que se envían los detalles de los pedidos cuando el cliente finaliza una compra o desde el detalle de la orden.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-green-100 text-green-600">
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Botón Flotante</p>
                    <p className="text-xs text-muted-foreground">Consultas generales</p>
                  </div>
                </div>
                <label className="grid gap-1.5 text-sm">
                  Número de WhatsApp
                  <Input
                    value={formState.floating_whatsapp}
                    onChange={(e) => handleChange("floating_whatsapp", e.target.value)}
                    placeholder="+584121234567"
                  />
                  <span className="text-xs text-muted-foreground">Formato: +58XXXXXXXXXX</span>
                </label>
              </div>

              <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">WhatsApp de Órdenes</p>
                    <p className="text-xs text-muted-foreground">Pedidos y compras</p>
                  </div>
                </div>
                <label className="grid gap-1.5 text-sm">
                  Número de WhatsApp
                  <Input
                    value={formState.order_whatsapp}
                    onChange={(e) => handleChange("order_whatsapp", e.target.value)}
                    placeholder="+584121234567"
                  />
                  <span className="text-xs text-muted-foreground">Formato: +58XXXXXXXXXX</span>
                </label>
              </div>
            </div>
          </SettingsSection>
        </TabsContent>

        {/* ─── TAB: Redes Sociales ─── */}
        <TabsContent value="social">
          <SettingsSection
            title="Redes Sociales"
            description="Agrega los enlaces a tus redes sociales para mostrarlos en la tienda."
            icon={icons.social}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{socialLinks.length} enlace{socialLinks.length !== 1 ? 's' : ''} configurado{socialLinks.length !== 1 ? 's' : ''}</p>
              <Button type="button" variant="outline" size="sm" onClick={addSocialLink} className="gap-1.5 rounded-lg">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Agregar red social
              </Button>
            </div>

            {socialLinks.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
                <svg className="size-8 text-slate-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                </svg>
                <p className="text-sm text-slate-500">No tienes redes sociales configuradas.</p>
                <p className="text-xs text-slate-400">Haz clic en "Agregar red social" para comenzar.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {socialLinks.map((link, idx) => (
                  <div key={idx} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 transition-shadow hover:shadow-sm">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-50 border border-slate-100">
                      <SocialMediaIcon platform={link.platform || 'default'} className="size-5" />
                    </div>
                    <div className="grid flex-1 gap-2 sm:grid-cols-2">
                      <select
                        value={link.platform || ''}
                        onChange={(e) => updateSocialLink(idx, "platform", e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="" disabled>Selecciona una red social</option>
                        {SOCIAL_PLATFORMS.map(p => (
                          <option key={p.id} value={p.id}>{p.label}</option>
                        ))}
                      </select>
                      <Input
                        type="url"
                        value={link.url || ''}
                        onChange={(e) => updateSocialLink(idx, "url", e.target.value)}
                        placeholder="https://instagram.com/mitienda"
                        className="text-sm"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSocialLink(idx)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-1"
                    >
                      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </SettingsSection>
        </TabsContent>

        {/* ─── TAB: Footer Links ─── */}
        <TabsContent value="footer">
          <SettingsSection
            title="Enlaces del Footer"
            description="Enlaces que aparecen en el pie de página de la tienda."
            icon={icons.footer}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{footerLinks.length} enlace{footerLinks.length !== 1 ? 's' : ''} configurado{footerLinks.length !== 1 ? 's' : ''}</p>
              <Button type="button" variant="outline" size="sm" onClick={addFooterLink} className="gap-1.5 rounded-lg">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Agregar enlace
              </Button>
            </div>

            {footerLinks.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
                <svg className="size-8 text-slate-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                </svg>
                <p className="text-sm text-slate-500">No hay enlaces del footer configurados.</p>
                <p className="text-xs text-slate-400">Haz clic en "Agregar enlace" para comenzar.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {footerLinks.map((link, idx) => (
                  <div key={idx} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 transition-shadow hover:shadow-sm">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                      </svg>
                    </div>
                    <div className="grid flex-1 gap-2 sm:grid-cols-2">
                      <Input
                        value={link.label || ''}
                        onChange={(e) => updateFooterLink(idx, "label", e.target.value)}
                        placeholder="Ej: Política de privacidad"
                        className="text-sm"
                      />
                      <Input
                        type="url"
                        value={link.url || ''}
                        onChange={(e) => updateFooterLink(idx, "url", e.target.value)}
                        placeholder="https://mitienda.com/privacidad"
                        className="text-sm"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFooterLink(idx)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-1"
                    >
                      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </SettingsSection>
        </TabsContent>

        {/* ─── TAB: Avanzado ─── */}
        <TabsContent value="advanced">
          <SettingsSection
            title="Configuración Avanzada"
            description="Límites y parámetros técnicos de la tienda."
            icon={icons.advanced}
          >
            <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                  </svg>
                </div>
                <div className="text-sm text-amber-800">
                  <p className="font-medium">Precaución</p>
                  <p className="mt-1 text-amber-700">Estos valores afectan la estructura de categorías de la tienda. Modificarlos puede impactar la organización de productos existentes.</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-1.5 text-sm font-medium">
                Subcategorías máximas por categoría
                <Input
                  type="number"
                  value={formState.category_max_children}
                  onChange={(e) => handleChange("category_max_children", e.target.value)}
                  placeholder="Ej: 5"
                  min={0}
                />
                <span className="text-xs text-muted-foreground">Cantidad máxima de subcategorías que puede tener una categoría padre.</span>
              </label>
              <label className="grid gap-1.5 text-sm font-medium">
                Profundidad máxima de categorías
                <Input
                  type="number"
                  value={formState.category_max_depth}
                  onChange={(e) => handleChange("category_max_depth", e.target.value)}
                  placeholder="Ej: 3"
                  min={0}
                />
                <span className="text-xs text-muted-foreground">Niveles máximos de anidamiento de categorías (ej: Ropa → Hombre → Camisas).</span>
              </label>
            </div>
          </SettingsSection>
        </TabsContent>
      </Tabs>

      {/* ─── Botón de guardar fijo ─── */}
      <div className="flex items-center justify-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-xs text-muted-foreground mr-auto">Los cambios no se guardan automáticamente.</p>
        <Button
          onClick={handleSubmit}
          disabled={isSaving}
          className="gap-2 rounded-lg px-6"
        >
          {isSaving ? (
            <>
              <svg className="size-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Guardando...
            </>
          ) : (
            <>
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              {data ? "Actualizar ajustes" : submitLabel}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}