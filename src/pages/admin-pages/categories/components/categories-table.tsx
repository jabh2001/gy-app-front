import type { Category } from "@/api/models"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Check, Grid, X } from "lucide-react"
import { Link } from "react-router-dom"

type Props = {
  categories: Category[]
}

export default function CategoriesTable({ categories }: Props) {
  return (
    <Table>
      <TableCaption>Lista de categorías registradas.</TableCaption>

      <TableHeader>
        <TableRow>
          <TableHead className="w-[80px]">ID</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead className="w-[80px]">
            <div className="flex justify-center">Activa</div>
          </TableHead>
          <TableHead className="w-[80px]">
            <div className="flex justify-center">Destacada</div>
          </TableHead>
          <TableHead className="w-[80px]">
            <div className="flex justify-center">Detalle</div>
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {categories.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
              No hay categorías registradas.
            </TableCell>
          </TableRow>
        ) : (
          categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.id}</TableCell>

              <TableCell>{category.name}</TableCell>

              <TableCell>{category.slug}</TableCell>

              <TableCell>
                <div className="flex justify-center">
                  <CheckCell checked={category.is_active} />
                </div>
              </TableCell>

              <TableCell>
                <div className="flex justify-center">
                  <CheckCell checked={category.is_featured} />
                </div>
              </TableCell>

              <TableCell>
                <Link to={`detail/${category.id}`} className="flex justify-center hover:opacity-80 transition-opacity">
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

const CheckCell = ({ checked }: { checked: boolean }) => {
  return checked ? (
    <Check className="size-4 rounded border border-primary stroke-primary" />
  ) : (
    <X className="size-4 rounded border border-red-500 stroke-red-500" />
  )
}