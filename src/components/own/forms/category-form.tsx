import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import AdminForm from "./admin-form"

export interface CategoryFormData {
  id?: number
  name: string
  slug: string
  description: string
  isFeatured: boolean
  isActive: boolean
}

interface CategoryFormProps {
  data?: CategoryFormData
  onSave: (category: CategoryFormData) => void
  onEdit: (category: CategoryFormData) => void
  submitLabel?: string
}

export default function CategoryForm({ data, onSave, onEdit, submitLabel = "Guardar categoría" }: CategoryFormProps) {
  const [formState, setFormState] = useState<CategoryFormData>({
    name: "",
    slug: "",
    description: "",
    isFeatured: false,
    isActive:true
  })

  useEffect(() => {
    if (data) {
      setFormState(data)
    }
  }, [data])

  const handleChange = (key: keyof CategoryFormData, value: string | boolean) => {
    setFormState((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = () => {
    if (data?.id) {
      onEdit(formState)
      return
    }
    onSave(formState)
    setFormState({ name: "", slug: "", description: "", isFeatured: false , isActive: false })
  }

  return (
    <AdminForm
      title={data ? "Editar categoría" : "Nueva categoría"}
      description="Crea y mantiene las categorías de productos de tu tienda."
      submitLabel={submitLabel}
      submitLabelOnEdit="Actualizar categoría"
      isEditing={Boolean(data)}
      onSubmit={handleSubmit}
    >
      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium">
          Nombre
          <Input
            value={formState.name}
            onChange={(event) => handleChange("name", event.target.value)}
            placeholder="Camisetas"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Slug
          <Input
            value={formState.slug}
            onChange={(event) => handleChange("slug", event.target.value)}
            placeholder="camisetas"
          />
        </label>
      </div>
      <label className="grid gap-1 text-sm font-medium">
        Descripción
        <textarea
          className="min-h-[100px] w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          value={formState.description}
          onChange={(event) => handleChange("description", event.target.value)}
          placeholder="Categoría para camisetas, remeras y polos."
        />
      </label>
      <label className="inline-flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={formState.isActive}
          onChange={(event) => handleChange("isActive", event.target.checked)}
          className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
        />
        Categoría activa
      </label>
      <label className="inline-flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={formState.isFeatured}
          onChange={(event) => handleChange("isFeatured", event.target.checked)}
          className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
        />
        Categoría destacada
      </label>
    </AdminForm>
  )
}
