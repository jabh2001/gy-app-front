import { useState } from "react"
import { useNavigate } from "react-router-dom"
import SettingsForm from "@/components/own/forms/settings-form"
import { useSettings, useUpdateSettings } from "@/hooks/api"
import type { SiteSettings } from "@/api/models"
import type { SettingsFormData } from "@/components/own/forms/settings-form"
import useTitle from "@/hooks/use-title"

export default function SettingsAdminIndex() {
  useTitle("Editar ajustes - Panel de administración")
  const navigate = useNavigate()
  const { data: settings, isLoading } = useSettings()
  const updateSettings = useUpdateSettings()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleSave = async (payload: FormData) => {
    setErrorMessage(null)
    setSuccessMessage(null)
    try {
      await updateSettings.mutateAsync(payload)
      setSuccessMessage('Ajustes guardados correctamente.')
      setTimeout(() => setSuccessMessage(null), 4000)
    } catch (error) {
      setErrorMessage('No se pudieron guardar los ajustes. Intenta de nuevo.')
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6 px-4">
        <div>
          <h1 className="text-2xl font-semibold">Configuración</h1>
          <p className="text-sm text-muted-foreground">Cargando ajustes...</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <svg className="size-8 animate-spin text-muted-foreground" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      </div>
    )
  }

  if (!settings) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-4">
        <div>
          <h1 className="text-2xl font-semibold">
            Configuración
          </h1>
          <p className="text-sm text-muted-foreground">
            Administra la información general, imágenes, contactos y parámetros de tu tienda.
          </p>
        </div>
      </div>

      {/* Mensajes de estado */}
      {successMessage && (
        <div className="mx-4 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 animate-in fade-in slide-in-from-top-2 duration-300">
          <svg className="size-5 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="mx-4 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 animate-in fade-in slide-in-from-top-2 duration-300">
          <svg className="size-5 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
          {errorMessage}
        </div>
      )}

      <SettingsForm
        data={mapToFormData(settings)}
        onSave={handleSave}
        onEdit={handleSave}
        submitLabel="Guardar ajustes"
        isSaving={updateSettings.isLoading}
      />
    </div>
  )
}

const mapToFormData = (setting: SiteSettings) => ({
  site_name: setting.site_name,
  site_description: setting.site_description ?? "",
  logo_url: setting.logo_url ?? "",
  contact_email: setting.contact_email ?? "",
  floating_whatsapp: setting.floating_whatsapp ?? "",
  order_whatsapp: setting.order_whatsapp ?? "",
  category_max_children: setting.category_max_children ?? 0,
  category_max_depth: setting.category_max_depth ?? 0,
  hero_images: setting.hero_images,
  footer_links: setting.footer_links,
  social_links: setting.social_links,
})