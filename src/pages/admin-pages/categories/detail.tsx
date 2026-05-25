import { useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { CategoryFormData } from "@/components/own/forms/category-form"

const mockCategories: CategoryFormData[] = [
  { id: 1, name: "Camisetas", slug: "camisetas", description: "Ropa para hombre y mujer.", isFeatured: true },
  { id: 2, name: "Accesorios", slug: "accesorios", description: "Bolsos, gorras y complementos.", isFeatured: false },
]

export default function CategoriesAdminDetail() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const category = useMemo(
    () => mockCategories.find((item) => item.id === Number(id)),
    [id]
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Detalle de categoría</h1>
          <p className="text-sm text-muted-foreground">Visualiza todos los datos de la categoría seleccionada.</p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Regresar
        </Button>
      </div>

      {category ? (
        <Card>
          <CardHeader>
            <CardTitle>{category.name}</CardTitle>
            <CardDescription>{category.description}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium">Slug</p>
              <p className="text-foreground">{category.slug}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Destacado</p>
              <p className="text-foreground">{category.isFeatured ? "Sí" : "No"}</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">No se encontró la categoría solicitada.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
