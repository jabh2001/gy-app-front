import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import CategoryForm, { type CategoryFormData } from "@/components/own/forms/category-form"

const initialCategories: CategoryFormData[] = [
  { id: 1, name: "Camisetas", slug: "camisetas", description: "Ropa para hombre y mujer.", isFeatured: true },
  { id: 2, name: "Accesorios", slug: "accesorios", description: "Bolsos, gorras y complementos.", isFeatured: false },
]

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryFormData[]>(initialCategories)
  const [selectedCategory, setSelectedCategory] = useState<CategoryFormData | undefined>(undefined)
  const [editing, setEditing] = useState(false)

  const rows = useMemo(
    () =>
      categories.map((category) => (
        <tr key={category.id} className="border-b border-border/60">
          <td className="px-4 py-3 text-sm text-foreground">{category.name}</td>
          <td className="px-4 py-3 text-sm text-muted-foreground">{category.slug}</td>
          <td className="px-4 py-3 text-sm text-foreground">{category.isFeatured ? "Sí" : "No"}</td>
          <td className="px-4 py-3 text-right">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedCategory(category)
                setEditing(true)
              }}
            >
              Editar
            </Button>
          </td>
        </tr>
      )),
    [categories]
  )

  const handleSave = (category: CategoryFormData) => {
    setCategories((prev) => [
      ...prev,
      { ...category, id: prev.length ? Math.max(...prev.map((item) => item.id || 0)) + 1 : 1 },
    ])
    setSelectedCategory(undefined)
    setEditing(false)
  }

  const handleEdit = (updated: CategoryFormData) => {
    setCategories((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
    setSelectedCategory(undefined)
    setEditing(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Categorías</h1>
          <p className="text-sm text-muted-foreground">Administra las categorías disponibles para tus productos.</p>
        </div>
        <Button onClick={() => { setSelectedCategory(undefined); setEditing(true) }}>Nueva categoría</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de categorías</CardTitle>
          <CardDescription>Mantén las secciones del catálogo ordenadas y visibles.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
            <thead className="border-b border-border/70 text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Destacado</th>
                <th className="px-4 py-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>
        </CardContent>
      </Card>

      {editing ? (
        <CategoryForm data={selectedCategory} onSave={handleSave} onEdit={handleEdit} />
      ) : null}
    </div>
  )
}
