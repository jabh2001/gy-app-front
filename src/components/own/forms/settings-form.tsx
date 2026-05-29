import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import AdminForm from "./admin-form"

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
  hero_images?: string[]
  footer_links?: Record<string, string>[]
  social_links?: Record<string, string>[]
}

interface SettingsFormProps {
  data?: SettingsFormData
  onSave: (settings: SettingsFormData) => void
  onEdit: (settings: SettingsFormData) => void
  submitLabel?: string
}

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
    footer_links: [],
    social_links: []
  })

  useEffect(() => {
    if (data) {
      setFormState(data)
    }
  }, [data])

  // Se actualiza el tipado de handleChange para soportar números y strings
  const handleChange = (key: keyof SettingsFormData, value: string | number) => {
    setFormState((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = () => {
    // Podrías agregar conversiones a número aquí si es estrictamente necesario para tu API
    // ej: category_max_children: Number(formState.category_max_children)
    if (data) {
      onEdit(formState)
      return
    }
    onSave(formState)
  }

  return (
    <AdminForm
      title="Ajustes del Sitio"
      description="Modifica la información general, descripción y datos de contacto de tu Ecommerce."
      submitLabel={submitLabel}
      submitLabelOnEdit="Actualizar ajustes"
      isEditing={Boolean(data)}
      onSubmit={handleSubmit}
    >
      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium">
          Nombre del sitio
          <Input
            value={formState.site_name}
            onChange={(event) => handleChange("site_name", event.target.value)}
            placeholder="Mi Ecommerce"
            required
          />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Email de contacto
          <Input
            type="email"
            value={formState.contact_email}
            onChange={(event) => handleChange("contact_email", event.target.value)}
            placeholder="contacto@miecommerce.com"
          />
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-1">
        <label className="grid gap-1 text-sm font-medium">
          Descripción del sitio
          <Input
            value={formState.site_description}
            onChange={(event) => handleChange("site_description", event.target.value)}
            placeholder="Breve descripción de la tienda..."
          />
        </label>
      </div>

      <div className="gridm hidden gap-3 md:grid-cols-1">
        <label className="grid gap-1 text-sm font-medium">
          URL del Logo
          <Input
            type="url"
            value={formState.logo_url}
            onChange={(event) => handleChange("logo_url", event.target.value)}
            placeholder="https://ejemplo.com/logo.png"
          />
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium">
          WhatsApp (Botón Flotante)
          <Input
            value={formState.floating_whatsapp}
            onChange={(event) => handleChange("floating_whatsapp", event.target.value)}
            placeholder="+521234567890"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          WhatsApp (Para Órdenes)
          <Input
            value={formState.order_whatsapp}
            onChange={(event) => handleChange("order_whatsapp", event.target.value)}
            placeholder="+521234567890"
          />
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium">
          Subcategorías Máximas (Hijos)
          <Input
            type="number"
            value={formState.category_max_children}
            onChange={(event) => handleChange("category_max_children", event.target.value)}
            placeholder="Ej: 5"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Profundidad Máxima de Categorías
          <Input
            type="number"
            value={formState.category_max_depth}
            onChange={(event) => handleChange("category_max_depth", event.target.value)}
            placeholder="Ej: 3"
          />
        </label>
      </div>
    </AdminForm>
  )
}