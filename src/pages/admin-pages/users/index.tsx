import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { UserFormData } from "@/components/own/forms/user-form"

const mockUsers: UserFormData[] = [
  { id: 1, name: "María López", email: "maria@demo.com", role: "Admin", status: "Activo" },
  { id: 2, name: "Pedro Ruiz", email: "pedro@demo.com", role: "Vendedor", status: "Activo" },
]

export default function UsersAdminIndex() {
  const [query, setQuery] = useState("")
  const navigate = useNavigate()

  const filteredUsers = useMemo(
    () =>
      mockUsers.filter((user) =>
        [user.name, user.email, user.role, user.status].some((value) =>
          value.toLowerCase().includes(query.toLowerCase())
        )
      ),
    [query]
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Usuarios</h1>
          <p className="text-sm text-muted-foreground">Gestiona los usuarios y sus roles en el panel administrativo.</p>
        </div>
        <Button onClick={() => navigate("create")}>Crear usuario</Button>
      </div>

      <div className="grid gap-4 rounded-3xl border border-border/70 bg-muted p-4 md:grid-cols-[1fr_auto]">
        <label className="grid gap-2">
          <span className="text-sm font-medium">Buscar</span>
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar usuario, email o rol"
          />
        </label>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl border border-border/70 bg-background px-4 py-3 text-sm text-muted-foreground">
            Espacio para filtros
          </div>
          <div className="rounded-xl border border-border/70 bg-background px-4 py-3 text-sm text-muted-foreground">
            Ordenar y refinamiento
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="space-y-4">
            <CardHeader>
              <CardTitle>{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <div className="text-sm text-muted-foreground">Rol: {user.role}</div>
              <div className="text-sm text-muted-foreground">Estado: {user.status}</div>
            </CardContent>
            <div className="flex flex-wrap items-center gap-2 px-4 pb-4">
              <Button variant="outline" size="sm" onClick={() => navigate(`edit/${user.id}`)}>
                Editar
              </Button>
              <Button variant="secondary" size="sm" onClick={() => navigate(`detail/${user.id}`)}>
                Ver detalle
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
