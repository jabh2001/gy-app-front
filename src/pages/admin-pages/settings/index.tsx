import { useNavigate, useParams } from "react-router-dom"
import SettingsForm from "@/components/own/forms/settings-form"
import { useSettings } from "@/hooks/api"
import type { SiteSettings } from "@/api/models"
import useTitle from "@/hooks/use-title"

export default function SettingsAdminIndex() {
  useTitle("Editar ajustes - Panel de administración")
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const editing = Boolean(id)
  const { data:settings } = useSettings()


  const handleSave = () => {
    navigate(-1)
  }

  const handleEdit = () => {
    navigate(-1)
  }
  if(!settings){
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
            Completa los datos para {editing ? "actualizar" : "configurar"} los ajustes de la tienda.
          </p>
        </div>
      </div>

      <SettingsForm data={mapToFormData(settings)} onSave={handleSave} onEdit={handleEdit} submitLabel="Guardar ajustes" />
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
  footer_links:setting.footer_links,
  social_links:setting.social_links,
})