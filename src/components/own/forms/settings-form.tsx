import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import AdminForm from "./admin-form"

export interface SettingsFormData {
  storeName: string
  currency: string
  taxRate: string
  supportEmail: string
}

interface SettingsFormProps {
  data?: SettingsFormData
  onSave: (settings: SettingsFormData) => void
  onEdit: (settings: SettingsFormData) => void
  submitLabel?: string
}

export default function SettingsForm({ data, onSave, onEdit, submitLabel = "Guardar ajustes" }: SettingsFormProps) {
  const [formState, setFormState] = useState<SettingsFormData>({
    storeName: "Mi tienda",
    currency: "USD",
    taxRate: "21",
    supportEmail: "soporte@tienda.com",
  })

  useEffect(() => {
    if (data) {
      setFormState(data)
    }
  }, [data])

  const handleChange = (key: keyof SettingsFormData, value: string) => {
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
    <AdminForm
      title="Ajustes de la tienda"
      description="Modifica la información general y los datos de contacto del panel administrativo."
      submitLabel={submitLabel}
      submitLabelOnEdit="Actualizar ajustes"
      isEditing={Boolean(data)}
      onSubmit={handleSubmit}
    >
      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium">
          Nombre de la tienda
          <Input
            value={formState.storeName}
            onChange={(event) => handleChange("storeName", event.target.value)}
            placeholder="Mi tienda"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Moneda
          <Input
            value={formState.currency}
            onChange={(event) => handleChange("currency", event.target.value)}
            placeholder="USD"
          />
        </label>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium">
          IVA / Impuesto
          <Input
            value={formState.taxRate}
            onChange={(event) => handleChange("taxRate", event.target.value)}
            placeholder="21"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Email de soporte
          <Input
            value={formState.supportEmail}
            onChange={(event) => handleChange("supportEmail", event.target.value)}
            placeholder="soporte@tienda.com"
          />
        </label>
      </div>
    </AdminForm>
  )
}
