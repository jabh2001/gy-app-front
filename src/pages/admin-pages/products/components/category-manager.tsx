import { useState, useRef, useEffect } from "react"
import { useQuery } from "react-query"
import { X, Plus, ChevronDown, Search, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import api from "@/api"
import { useUpdateProductCategories } from "@/hooks/api/useProducts"
import type { Category, Product } from "@/api/models"

export default function CategoryManager({ product }: { product: Product }) {
  const assignedIds = product.categories.map((c) => c.id)
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)

  const { data: allCategories = [] } = useQuery<Category[]>(
    ["all-categories"],
    async () => {
      const result = await api.get("/categories/", { params: { page_size: 100 } }) as any
      return result?.items || result || []
    },
    { staleTime: 60000 }
  )

  const updateCategories = useUpdateProductCategories()

  const availableCategories = allCategories?.filter(
    (c) => !assignedIds.includes(c.id) && c.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleAdd = (categoryId: number) => {
    const nextIds = [...assignedIds, categoryId]
    updateCategories.mutate({ productId: product.id, categoryIds: nextIds })
    setOpen(false)
    setSearch("")
  }

  const handleRemove = (categoryId: number) => {
    const nextIds = assignedIds.filter((id) => id !== categoryId)
    updateCategories.mutate({ productId: product.id, categoryIds: nextIds })
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground">
        {product.categories.length} categoría{product.categories.length !== 1 ? "s" : ""} asignada{product.categories.length !== 1 ? "s" : ""}
      </h3>

      {product.categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {product.categories.map((cat) => (
            <span
              key={cat.id}
              className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-sm font-medium shadow-sm"
            >
              <Tag size={13} className="shrink-0 text-muted-foreground" />
              {cat.name}
              <button
                type="button"
                onClick={() => handleRemove(cat.id)}
                className="ml-1 rounded-full p-0.5 hover:bg-destructive/20 hover:text-destructive transition-colors"
                disabled={updateCategories.isLoading}
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      <div ref={containerRef} className="relative">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-between"
          disabled={updateCategories.isLoading}
          onClick={() => setOpen(!open)}
        >
          <span className="flex items-center gap-2">
            <Plus size={14} />
            Asignar categoría
          </span>
          <ChevronDown size={14} className={cn("text-muted-foreground transition-transform", open && "rotate-180")} />
        </Button>

        {open && (
          <div className="absolute z-50 mt-1 w-full rounded-lg border bg-popover shadow-md">
            <div className="flex items-center gap-2 border-b px-3 py-2">
              <Search size={14} className="text-muted-foreground shrink-0" />
              <Input
                placeholder="Buscar categoría..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-0 p-0 h-auto text-sm shadow-none focus-visible:ring-0"
              />
            </div>
            <div className="max-h-48 overflow-y-auto p-1">
              {availableCategories.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-6">
                  {search ? "Sin resultados." : "Sin categorías disponibles."}
                </p>
              ) : (
                availableCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleAdd(cat.id)}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors text-left"
                  >
                    <Tag size={13} className="text-muted-foreground shrink-0" />
                    {cat.name}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
