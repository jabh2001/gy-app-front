import type { Product } from "@/api/models";
import ProductForm from "@/components/own/forms/product-form"
import { useNavigate, useParams } from "react-router-dom";
import { useUpdateProduct } from "@/hooks/api";
import type { ProductFormData } from "@/components/own/forms/product-form"
import FlowbiteTabs from "@/components/own/flowbite-tabs";
import CategoryManager from "./category-manager"
import { useQueryClient } from "react-query"
import ImageManager from "./image-manager"

export default function FormTabs({ product }: { product: Product }) {
    return (
        <FlowbiteTabs
            tabs={[
                { id: "Datos", label: "Datos", content: <EditForm product={product} /> },
                { id: "imagenes", label: "Imagenes", content: <ImagesSection product={product} /> },
                { id: "Categorias", label: "Categorias", content: <CategoriesSection product={product} /> },
                { id: "Palabras clave", label: "Palabras clave", content: <>Palabras clave</> },
            ]}
        />
    )
}

function CategoriesSection({ product }: { product: Product }) {
    return (
        <div className="p-4">
            <CategoryManager product={product} />
        </div>
    )
}

function ImagesSection({ product }: { product: Product }) {
    return (
        <div className="p-4">
            <ImageManager product={product} />
        </div>
    )
}


function EditForm({ product }: { product: Product }) {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const updateProductMutation = useUpdateProduct()
    const qc = useQueryClient()

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

    const handleToggleSave = async (payload: Record<string, unknown>) => {
        if (!id) return
        const numericId = Number(id)
        qc.setQueryData<Product | undefined>(['product', numericId], (old) => {
            if (!old) return old
            return { ...old, ...payload }
        })
        try {
            await updateProductMutation.mutateAsync({ productId: numericId, payload: payload as any })
            qc.invalidateQueries(['product', numericId])
        } catch {
            qc.invalidateQueries(['product', numericId])
        }
    }

    return <ProductForm
        data={mapProductToFormData(product)}
        onEdit={handleEdit}
        onToggleSave={handleToggleSave}
        submitLabel={"Guardar producto"}
        onSave={async () => { }}
    />
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
        main_image: product.main_image ?? "",
        is_featured: product.is_featured,
        is_on_sale: product.is_on_sale,
        is_active: product.is_active,
        description: product.description ?? "",
        images: [],
        main_image_index: 0,
    }
}