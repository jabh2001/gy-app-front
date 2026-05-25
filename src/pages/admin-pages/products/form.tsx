import { useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import ProductForm, { type ProductFormData } from "@/components/own/forms/product-form"
import { useCreateProduct, useProductDetail, useUpdateProduct } from "@/hooks/api/useProducts"
import type { Product } from "@/api/models"

function mapProductToFormData(product: Product): ProductFormData {
  return {
    id: product.id,
    name: product.name,
    sku: product.sku ?? "",
    price: String(product.price ?? ""),
    sale_price: String(product.sale_price ?? ""),
    stock: String(product.stock ?? ""),
    badge: product.badge ?? "",
    mainImage: product.main_image ?? "",
    isFeatured: product.is_featured,
    isOnSale: product.is_on_sale,
    isActive: product.is_active,
    description: product.description ?? "",
    images: product.images ? product.images.map((img) => {
      // Convert image URLs to File objects if needed, or handle as necessary
      return new File([], img.url) // Placeholder, adjust as needed
    }) : [],
    mainImageIndex: 0,
  }
}

export default function ProductsAdminForm() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const editing = Boolean(id)
  const createProductMutation = useCreateProduct()
  const updateProductMutation = useUpdateProduct()
  const { data: productDetail } = useProductDetail(editing ? Number(id) : undefined)

  const selectedProduct = useMemo(() => {
    if (productDetail) {
      return mapProductToFormData(productDetail)
    }
  }, [id, productDetail])

  const handleSave = async (payload: FormData) => {
    try {
      await createProductMutation.mutateAsync(payload)
      navigate(-1)
    } catch (error) {
      console.error(error)
    }
  }

  const handleEdit = async (payload: FormData) => {
    if (!id) {
      navigate(-1)
      return
    }

    try {
      await updateProductMutation.mutateAsync({ productId: Number(id), payload })
      navigate(-1)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            {editing ? "Editar producto" : "Crear producto"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Completa los campos para {editing ? "actualizar" : "agregar"} un producto.
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Regresar
        </Button>
      </div>

      <ProductForm
        data={selectedProduct}
        onSave={handleSave}
        onEdit={handleEdit}
        submitLabel={editing ? "Guardar producto" : "Guardar producto"}
      />
    </div>
  )
}
