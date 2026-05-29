import type { User } from "@/api/models"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Grid } from "lucide-react"
import { Link } from "react-router-dom"

type Props = {
  users: User[]
}

export default function UsersTable({ users }: Props) {
  return (
    <Table>
      <TableCaption>Lista de usuarios registrados.</TableCaption>

      <TableHeader>
        <TableRow>
          <TableHead className="w-[80px]">ID</TableHead>
          <TableHead>Usuario</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Rol</TableHead>
          <TableHead className="w-[80px]">
            <div className="flex justify-center">Detalle</div>
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {users.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
              No hay usuarios registrados.
            </TableCell>
          </TableRow>
        ) : (
          users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.id}</TableCell>

              <TableCell>{user.username}</TableCell>

              <TableCell>{user.email}</TableCell>

              {/* Se agrega 'capitalize' para que roles como 'admin' o 'customer' se vean mejor */}
              <TableCell className="capitalize">{user.role}</TableCell>

              <TableCell>
                <Link to={`detail/${user.id}`} className="flex justify-center hover:opacity-80 transition-opacity">
                  <Grid className="size-8 fill-gray-300 stroke-white dark:stroke-black" />
                </Link>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}