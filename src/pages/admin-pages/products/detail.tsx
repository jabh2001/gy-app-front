import { useParams } from "react-router-dom"
import { useProductDetail } from "@/hooks/api"
import useTitle, { useViewPrevButton } from "@/hooks/use-title"
import FormTabs from "./components/form-tabs"

export default function ProductsAdminDetail() {
  useViewPrevButton(true)
  const { id } = useParams<{ id: string }>()

  const { data: product } = useProductDetail(id ? Number(id) : undefined)
  useTitle(product ? `${product.name.toUpperCase()}` : "Detalle de producto")


  return (
    <div className="space-y-6">
      
        { product && <FormTabs
          product={product}
        />}
    </div>
  )
}
