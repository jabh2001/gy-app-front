import { useEffect, useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import AdminForm from "./admin-form"

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export interface CategoryFormData {
  id?: number
  name: string
  slug: string
  description: string
  is_featured: boolean
  is_active: boolean
}

interface CategoryFormProps {
  data?: CategoryFormData
  onSave: (category: CategoryFormData) => void
  onEdit: (category: CategoryFormData) => void
  onToggleSave?: (payload: Partial<CategoryFormData>) => void
  submitLabel?: string
}

export default function CategoryForm({ data, onSave, onEdit, onToggleSave, submitLabel = "Guardar categoría" }: CategoryFormProps) {
  const [formState, setFormState] = useState<CategoryFormData>({
    name: "",
    slug: "",
    description: "",
    is_featured: false,
    is_active: true,
  })
  const slugManuallyEdited = useRef(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()
  const onToggleSaveRef = useRef(onToggleSave)
  onToggleSaveRef.current = onToggleSave
  const dataIdRef = useRef(data?.id)
  dataIdRef.current = data?.id

  useEffect(() => {
    if (data) {
      setFormState(data)
      slugManuallyEdited.current = true
    }
  }, [data])

  const handleToggle = (key: "is_featured" | "is_active", checked: boolean) => {
    setFormState((prev) => ({ ...prev, [key]: checked }))
    if (!dataIdRef.current || !onToggleSaveRef.current) return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      onToggleSaveRef.current?.({ id: dataIdRef.current!, [key]: checked })
    }, 800)
  }

  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [])

  const handleNameChange = (value: string) => {
    setFormState((prev) => ({
      ...prev,
      name: value,
      slug: slugManuallyEdited.current ? prev.slug : slugify(value),
    }))
  }

  const handleSlugChange = (value: string) => {
    slugManuallyEdited.current = true
    setFormState((prev) => ({ ...prev, slug: value }))
  }

  const handleChange = (key: keyof CategoryFormData, value: string | boolean) => {
    setFormState((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = () => {
    const newData = { ...formState }
    if (data?.id) {
      onEdit(newData)
      return
    }
    onSave(newData)
    setFormState({ name: "", slug: "", description: "", is_featured: false, is_active: false })
    slugManuallyEdited.current = false
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
            onChange={(event) => handleNameChange(event.target.value)}
            placeholder="Camisetas"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Slug
          <Input
            value={formState.slug}
            onChange={(event) => handleSlugChange(event.target.value)}
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
      <div className="flex items-center justify-between rounded-lg border p-3">
        <div className="space-y-0.5">
          <p className="text-sm font-medium">Categoría activa</p>
          <p className="text-xs text-muted-foreground">Visible en la tienda para los clientes.</p>
        </div>
        <Switch
          checked={formState.is_active}
          onCheckedChange={(checked) => handleToggle("is_active", checked)}
        />
      </div>
      <div className="flex items-center justify-between rounded-lg border p-3">
        <div className="space-y-0.5">
          <p className="text-sm font-medium">Categoría destacada</p>
          <p className="text-xs text-muted-foreground">Aparece en la sección de categorías destacadas.</p>
        </div>
        <Switch
          checked={formState.is_featured}
          onCheckedChange={(checked) => handleToggle("is_featured", checked)}
        />
      </div>
    </AdminForm>
  )
}
