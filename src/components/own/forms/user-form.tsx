import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import AdminForm from "./admin-form"

export interface UserFormData {
  id?: number
  name: string
  email: string
  role: string
  status: string
}

interface UserFormProps {
  data?: UserFormData
  onSave: (user: UserFormData) => void
  onEdit: (user: UserFormData) => void
  submitLabel?: string
}

export default function UserForm({ data, onSave, onEdit, submitLabel = "Guardar usuario" }: UserFormProps) {
  const [formState, setFormState] = useState<UserFormData>({
    name: "",
    email: "",
    role: "Vendedor",
    status: "Activo",
  })

  useEffect(() => {
    if (data) {
      setFormState(data)
    }
  }, [data])

  const handleChange = (key: keyof UserFormData, value: string) => {
    setFormState((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = () => {
    if (data?.id) {
      onEdit(formState)
      return
    }
    onSave(formState)
    setFormState({ name: "", email: "", role: "Vendedor", status: "Activo" })
  }

  return (
    <AdminForm
      title={data ? "Editar usuario" : "Nuevo usuario"}
      description="Gestiona los permisos y el estado de los usuarios del panel administrativo."
      submitLabel={submitLabel}
      submitLabelOnEdit="Actualizar usuario"
      isEditing={Boolean(data)}
      onSubmit={handleSubmit}
    >
      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium">
          Nombre
          <Input
            value={formState.name}
            onChange={(event) => handleChange("name", event.target.value)}
            placeholder="Carlos Martínez"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Email
          <Input
            value={formState.email}
            onChange={(event) => handleChange("email", event.target.value)}
            placeholder="carlos@email.com"
          />
        </label>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium">
          Rol
          <Input
            value={formState.role}
            onChange={(event) => handleChange("role", event.target.value)}
            placeholder="Admin / Vendedor"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Estado
          <Input
            value={formState.status}
            onChange={(event) => handleChange("status", event.target.value)}
            placeholder="Activo"
          />
        </label>
      </div>
    </AdminForm>
  )
}
