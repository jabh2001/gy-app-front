export type UserRole = "admin" | "seller" | "customer"
export type UserStatus = "Activo" | "Inactivo"

export interface UserFormData {
  id?: number
  username: string
  email: string
  role: UserRole
  status: UserStatus
  password?: string
}

export const roleOptions: { value: UserRole; label: string }[] = [
  { value: "admin", label: "Administrador" },
  { value: "seller", label: "Vendedor" },
  { value: "customer", label: "Cliente" },
]

export const statusOptions: UserStatus[] = ["Activo", "Inactivo"]

export function getRoleLabel(role: UserRole): string {
  return roleOptions.find((option) => option.value === role)?.label ?? role
}
