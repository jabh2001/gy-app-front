import { useState } from "react"
import { EnvelopeSimple, LockKey, User, UserGear } from "@phosphor-icons/react"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import AdminForm from "./admin-form"
import { roleOptions, type UserFormData, type UserRole } from "./user-form.types"

const emptyUserState: UserFormData = {
  username: "",
  email: "",
  role: "seller",
  status: "Activo",
  password: "",
}

interface UserFormProps {
  data?: UserFormData
  onSave: (user: UserFormData) => void
  onEdit: (user: UserFormData) => void
  submitLabel?: string
}

export default function UserForm({ data, onSave, onEdit, submitLabel = "Guardar usuario" }: UserFormProps) {
  const [formState, setFormState] = useState<UserFormData>(() =>
    data
      ? { ...emptyUserState, ...data, password: "" }
      : emptyUserState
  )

  const handleChange = <K extends keyof UserFormData>(key: K, value: UserFormData[K]) => {
    setFormState((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = () => {
    const payload = { ...formState }
    if (!payload.password) {
      delete payload.password
    }

    if (data?.id) {
      onEdit(payload)
      return
    }
    onSave(payload)
    setFormState(emptyUserState)
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
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-1.5 text-sm font-medium">
          Nombre completo
          <div className="relative">
            <User className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={formState.username}
              onChange={(event) => handleChange("username", event.target.value)}
              placeholder="Carlos Martínez"
              className="pl-9"
            />
          </div>
        </label>

        <label className="grid gap-1.5 text-sm font-medium">
          Correo electrónico
          <div className="relative">
            <EnvelopeSimple className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="email"
              value={formState.email}
              onChange={(event) => handleChange("email", event.target.value)}
              placeholder="carlos@email.com"
              className="pl-9"
            />
          </div>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-1.5 text-sm font-medium">
          Rol
          <Select
            value={formState.role}
            onValueChange={(value) => handleChange("role", value as UserRole)}
          >
            <SelectTrigger className="w-full">
              <div className="flex items-center gap-2">
                <UserGear className="size-4 text-muted-foreground" />
                <SelectValue placeholder="Selecciona un rol" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {roleOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="space-y-0.5">
            <p className="text-sm font-medium">Usuario activo</p>
            <p className="text-xs text-muted-foreground">
              Determina si el usuario puede iniciar sesión en la plataforma.
            </p>
          </div>
          <Switch
            checked={formState.status === "Activo"}
            onCheckedChange={(checked) => handleChange("status", checked ? "Activo" : "Inactivo")}
          />
        </div>
      </div>

      {!data?.id ? (
        <label className="grid gap-1.5 text-sm font-medium">
          Contraseña
          <div className="relative">
            <LockKey className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="password"
              value={formState.password ?? ""}
              onChange={(event) => handleChange("password", event.target.value)}
              placeholder="••••••••"
              className="pl-9"
            />
          </div>
          <span className="text-xs text-muted-foreground">
            La contraseña es obligatoria al crear un nuevo usuario.
          </span>
        </label>
      ) : null}
    </AdminForm>
  )
}
