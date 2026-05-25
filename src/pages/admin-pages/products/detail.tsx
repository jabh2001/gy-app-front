import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import type { ProductFormData } from "@/components/own/forms/product-form"
import { useProductDetail, useUpdateProduct, type Product } from "@/hooks/api"
import ProductForm from "@/components/own/forms/product-form"
import useTitle from "@/hooks/use-title"

export default function ProductsAdminDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: product } = useProductDetail(id ? Number(id) : undefined)
  const updateProductMutation = useUpdateProduct()
  useTitle(product ? `${product.name.toUpperCase()}` : "Detalle de producto")

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
          <h1 className="text-2xl font-semibold">Detalle de producto</h1>
          <p className="text-sm text-muted-foreground">Revisa la información completa de este producto.</p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Regresar
        </Button>
      </div>
      <div className="rounded-lg p-16">
        {product && (
          <ProductForm
            data={mapProductToFormData(product)}
            onEdit={handleEdit}
            submitLabel={"Guardar producto"}
            onSave={async () => { }} // No se necesita onSave en el detalle, pero se requiere para el tipo
          />
        )}
      </div>
    </div>
  )
}

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
    images: [],
    mainImageIndex: 0,
  }
}