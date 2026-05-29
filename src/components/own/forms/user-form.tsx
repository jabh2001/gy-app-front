import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import AdminForm from "./admin-form"

export interface UserFormData {
  id?: number
  username: string
  email: string
  role: 'admin' | 'seller' | 'customer';
}

interface UserFormProps {
  data?: UserFormData
  onSave: (user: UserFormData) => void
  onEdit: (user: UserFormData) => void
  submitLabel?: string
}

export default function UserForm({ data, onSave, onEdit, submitLabel = "Guardar usuario" }: UserFormProps) {
  const [formState, setFormState] = useState<UserFormData>({
    username: "",
    email: "",
    role: "admin",
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
    setFormState({ username: "", email: "", role: "admin" })
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
            value={formState.username}
            onChange={(event) => handleChange("username", event.target.value)}
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
      </div>
    </AdminForm>
  )
}
