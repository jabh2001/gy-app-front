import { Link, useNavigate, useParams } from "react-router-dom"
import type { CategoryFormData } from "@/components/own/forms/category-form"
import useTitle, { useViewPrevButton } from "@/hooks/use-title"
import { useCategoryDetail, useUpdateCategory } from "@/hooks/api"
import CategoryForm from "@/components/own/forms/category-form"
import type { Category } from "@/api/models"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"


export default function CategoriesAdminDetail() {
  useViewPrevButton(true)
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { data: category } = useCategoryDetail(id)
  useTitle(category ? `${category.name.toUpperCase()}` : "Detalle de categoría")
  const updateCategoryMutation = useUpdateCategory()
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
    isFeatured: product.is_featured,
    isActive: product.is_active,
  }
}