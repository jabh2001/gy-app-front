import { useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import SettingsForm from "@/components/own/forms/settings-form"
import type { SettingsFormData } from "@/components/own/forms/settings-form"

interface SettingsData extends SettingsFormData {
  id: number
}

const mockSettings: SettingsData[] = [
  {
    id: 1,
    storeName: "GyApp Store",
    currency: "USD",
    taxRate: "21",
    supportEmail: "soporte@gyapp.com",
  },
]

export default function SettingsAdminForm() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const editing = Boolean(id)

  const selectedSettings = useMemo(
    () => mockSettings.find((settings) => settings.id === Number(id)),
    [id]
  )

  const handleSave = () => {
    navigate(-1)
  }

  const handleEdit = () => {
    navigate(-1)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            {editing ? "Editar ajustes" : "Crear ajustes"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Completa los datos para {editing ? "actualizar" : "configurar"} los ajustes de la tienda.
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Regresar
        </Button>
      </div>

      <SettingsForm data={selectedSettings} onSave={handleSave} onEdit={handleEdit} submitLabel="Guardar ajustes" />
    </div>
  )
}
