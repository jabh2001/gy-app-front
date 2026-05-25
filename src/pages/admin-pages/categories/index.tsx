import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { CategoryFormData } from "@/components/own/forms/category-form"

const mockCategories: CategoryFormData[] = [
  { id: 1, name: "Camisetas", slug: "camisetas", description: "Ropa para hombre y mujer.", isFeatured: true },
  { id: 2, name: "Accesorios", slug: "accesorios", description: "Bolsos, gorras y complementos.", isFeatured: false },
]

export default function CategoriesAdminIndex() {
  const [query, setQuery] = useState("")
  const navigate = useNavigate()

  const filteredCategories = useMemo(
    () =>
      mockCategories.filter((category) =>
        [category.name, category.slug, category.description].some((value) =>
          value.toLowerCase().includes(query.toLowerCase())
        )
      ),
    [query]
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Categorías</h1>
          <p className="text-sm text-muted-foreground">Administra las categorías del catálogo.</p>
        </div>
        <Button onClick={() => navigate("create")}>Crear categoría</Button>
      </div>

      <div className="grid gap-4 rounded-3xl border border-border/70 bg-muted p-4 md:grid-cols-[1fr_auto]">
        <label className="grid gap-2">
          <span className="text-sm font-medium">Buscar</span>
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar categoría o slug"
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
        {filteredCategories.map((category) => (
          <Card key={category.id} className="space-y-4">
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <div className="text-sm text-muted-foreground">Slug: {category.slug}</div>
              <div className="text-sm text-muted-foreground">Destacado: {category.isFeatured ? "Sí" : "No"}</div>
            </CardContent>
            <div className="flex flex-wrap items-center gap-2 px-4 pb-4">
              <Button variant="outline" size="sm" onClick={() => navigate(`edit/${category.id}`)}>
                Editar
              </Button>
              <Button variant="secondary" size="sm" onClick={() => navigate(`detail/${category.id}`)}>
                Ver detalle
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
