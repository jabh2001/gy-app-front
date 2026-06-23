import { Link, useNavigate, useParams } from "react-router-dom"
import type { CategoryFormData } from "@/components/own/forms/category-form"
import useTitle, { useViewPrevButton } from "@/hooks/use-title"
import { useCategoryDetail, useUpdateCategory } from "@/hooks/api"
import CategoryForm from "@/components/own/forms/category-form"
import type { Category } from "@/api/models"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { useQueryClient } from "react-query"


export default function CategoriesAdminDetail() {
  useViewPrevButton(true)
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { data: category } = useCategoryDetail(id)
  useTitle(category ? `${category.name.toUpperCase()}` : "Detalle de categoría")
  const updateCategoryMutation = useUpdateCategory()
  const qc = useQueryClient()

  const handleEdit = async (payload: Partial<Category>) => {
    if (!id) {
      navigate(-1)
      return
    }
    try {
      await updateCategoryMutation.mutateAsync({ categoryId: Number(id), payload })
      navigate(-1)
    } catch (error) {
      console.error(error)
    }
  }

  const handleToggleSave = async (payload: Partial<Category>) => {
    if (!id) return
    const categoryId = Number(id)
    qc.setQueryData<Category | undefined>(['category', id, 'as_list'], (old) => {
      if (!old) return old
      return { ...old, ...payload }
    })
    try {
      await updateCategoryMutation.mutateAsync({ categoryId, payload })
      qc.invalidateQueries(['category', id])
    } catch {
      qc.invalidateQueries(['category', id])
    }
  }


  return (
    <div className="">
      { Array.isArray(category?.path) && category.path.length > 1 && <Breadcrumb className="p-4">
        <BreadcrumbList>
          {
            category.path.map((cat, i, path) => (
              <>
                <BreadcrumbItem key={`breadcrumbs_${cat.id}`}>
                  <BreadcrumbLink>
                    <Link to={`/admin/categories/detail/${cat.id}`}>
                      {cat.name}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {i+1 < path.length && <BreadcrumbSeparator /> }
              </>
            ))
          }
        </BreadcrumbList>
      </Breadcrumb>}
      {category && <CategoryForm
        data={mapCategorytToFormData(category)}
        onEdit={handleEdit}
        onToggleSave={handleToggleSave}
        submitLabel="Editar categoría"
        onSave={() => { }}
      />}
    </div>
  )
}

function mapCategorytToFormData(product: Category): CategoryFormData {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description ?? "",
    is_featured: product.is_featured,
    is_active: product.is_active,
  }
}