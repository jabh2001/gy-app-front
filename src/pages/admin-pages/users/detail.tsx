import { useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { UserFormData } from "@/components/own/forms/user-form"

const mockUsers: UserFormData[] = [
  { id: 1, name: "María López", email: "maria@demo.com", role: "Admin", status: "Activo" },
  { id: 2, name: "Pedro Ruiz", email: "pedro@demo.com", role: "Vendedor", status: "Activo" },
]

export default function UsersAdminDetail() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const user = useMemo(
    () => mockUsers.find((item) => item.id === Number(id)),
    [id]
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Detalle de usuario</h1>
          <p className="text-sm text-muted-foreground">Visualiza todos los datos de este usuario.</p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Regresar
        </Button>
      </div>

      {user ? (
        <Card>
          <CardHeader>
            <CardTitle>{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium">Rol</p>
              <p className="text-foreground">{user.role}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Estado</p>
              <p className="text-foreground">{user.status}</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">No se encontró el usuario solicitado.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
