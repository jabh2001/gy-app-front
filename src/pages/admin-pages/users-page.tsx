import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import UserForm, { type UserFormData } from "@/components/own/forms/user-form"

const initialUsers: UserFormData[] = [
  { id: 1, name: "María López", email: "maria@demo.com", role: "Admin", status: "Activo" },
  { id: 2, name: "Pedro Ruiz", email: "pedro@demo.com", role: "Vendedor", status: "Activo" },
]

export default function UsersPage() {
  const [users, setUsers] = useState<UserFormData[]>(initialUsers)
  const [selectedUser, setSelectedUser] = useState<UserFormData | undefined>(undefined)
  const [editing, setEditing] = useState(false)

  const rows = useMemo(
    () =>
      users.map((user) => (
        <tr key={user.id} className="border-b border-border/60">
          <td className="px-4 py-3 text-sm text-foreground">{user.name}</td>
          <td className="px-4 py-3 text-sm text-muted-foreground">{user.email}</td>
          <td className="px-4 py-3 text-sm text-foreground">{user.role}</td>
          <td className="px-4 py-3 text-sm text-muted-foreground">{user.status}</td>
          <td className="px-4 py-3 text-right">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedUser(user)
                setEditing(true)
              }}
            >
              Editar
            </Button>
          </td>
        </tr>
      )),
    [users]
  )

  const handleSave = (user: UserFormData) => {
    setUsers((prev) => [
      ...prev,
      { ...user, id: prev.length ? Math.max(...prev.map((item) => item.id || 0)) + 1 : 1 },
    ])
    setSelectedUser(undefined)
    setEditing(false)
  }

  const handleEdit = (updated: UserFormData) => {
    setUsers((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
    setSelectedUser(undefined)
    setEditing(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Usuarios</h1>
          <p className="text-sm text-muted-foreground">Crea, edita y controla los roles de acceso del equipo.</p>
        </div>
        <Button onClick={() => { setSelectedUser(undefined); setEditing(true) }}>Nuevo usuario</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Equipo administrativo</CardTitle>
          <CardDescription>Administra cuentas de acceso y permisos dentro de la plataforma.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
            <thead className="border-b border-border/70 text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>
        </CardContent>
      </Card>

      {editing ? (
        <UserForm data={selectedUser} onSave={handleSave} onEdit={handleEdit} />
      ) : null}
    </div>
  )
}
