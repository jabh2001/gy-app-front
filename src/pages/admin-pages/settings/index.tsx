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
  const { data: settings } = useSettings()
  const updateSettings = useUpdateSettings()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSave = async (payload: SettingsFormData) => {
    setErrorMessage(null)
    try {
      await updateSettings.mutateAsync(payload)
      navigate(-1)
    } catch (error) {
      setErrorMessage('No se pudieron guardar los ajustes. Intenta de nuevo.')
    }
  }

  if (!settings) {
    return null
  }


  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-4">
        <div>
          <h1 className="text-2xl font-semibold">
            Editar ajustes
          </h1>
          <p className="text-sm text-muted-foreground">
            Completa los datos para actualizar los ajustes de la tienda.
          </p>
        </div>
      </div>

      {errorMessage ? <p className="text-sm text-red-600 px-4">{errorMessage}</p> : null}
      <SettingsForm data={mapToFormData(settings)} onSave={handleSave} onEdit={handleSave} submitLabel="Guardar ajustes" />
    </div>
  )
}

const mapToFormData = (setting:SiteSettings) => ({
  site_name:setting.site_name,
  site_description:setting.site_description ?? "",
  logo_url:setting.logo_url ?? "",
  contact_email:setting.contact_email ?? "",
  floating_whatsapp:setting.floating_whatsapp ?? "",
  order_whatsapp:setting.order_whatsapp ?? "",
  category_max_children:setting.category_max_children ?? 0,
  category_max_depth:setting.category_max_depth ?? 0,
  hero_images:setting.hero_images,
  banner_images:setting.banner_images,
  footer_links:setting.footer_links,
  social_links:setting.social_links,
})