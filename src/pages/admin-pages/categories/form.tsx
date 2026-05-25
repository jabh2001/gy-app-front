import { useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import CategoryForm from "@/components/own/forms/category-form"
import type { CategoryFormData } from "@/components/own/forms/category-form"

const mockCategories: CategoryFormData[] = [
  { id: 1, name: "Camisetas", slug: "camisetas", description: "Ropa para hombre y mujer.", isFeatured: true },
  { id: 2, name: "Accesorios", slug: "accesorios", description: "Bolsos, gorras y complementos.", isFeatured: false },
]

export default function CategoriesAdminForm() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const editing = Boolean(id)

  const selectedCategory = useMemo(
    () => mockCategories.find((category) => category.id === Number(id)),
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
            {editing ? "Editar categoría" : "Crear categoría"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Completa los campos para {editing ? "actualizar" : "crear"} una categoría.
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Regresar
        </Button>
      </div>

      <CategoryForm data={selectedCategory} onSave={handleSave} onEdit={handleEdit} submitLabel="Guardar categoría" />
    </div>
  )
}
