import { useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import UserForm from "@/components/own/forms/user-form"
import type { UserFormData } from "@/components/own/forms/user-form"

const mockUsers: UserFormData[] = [
  { id: 1, name: "María López", email: "maria@demo.com", role: "Admin", status: "Activo" },
  { id: 2, name: "Pedro Ruiz", email: "pedro@demo.com", role: "Vendedor", status: "Activo" },
]

export default function UsersAdminForm() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const editing = Boolean(id)

  const selectedUser = useMemo(
    () => mockUsers.find((user) => user.id === Number(id)),
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
            {editing ? "Editar usuario" : "Crear usuario"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Completa los datos para {editing ? "actualizar" : "agregar"} un usuario.
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Regresar
        </Button>
      </div>

      <UserForm data={selectedUser} onSave={handleSave} onEdit={handleEdit} submitLabel="Guardar usuario" />
    </div>
  )
}
