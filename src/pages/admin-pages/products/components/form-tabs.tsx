import type { Product } from "@/api/models";
import ProductForm from "@/components/own/forms/product-form"
import { useNavigate, useParams } from "react-router-dom";
import { useUpdateProduct } from "@/hooks/api";
import type { ProductFormData } from "@/components/own/forms/product-form"
import FlowbiteTabs from "@/components/own/flowbite-tabs";

export default function FormTabs({ product }: { product: Product }) {
    return (
        <FlowbiteTabs
            // className="max-w-full"
            tabs={[
                { id: "Datos", label: "Datos", content: <EditForm product={product} /> },
                { id: "imagenes", label: "Imagenes", content: <>imagenes</> },
                { id: "Categorias", label: "Categorias", content: <>Categorias</> },
                { id: "Palabras clave", label: "Palabras clave", content: <>Palabras clave</> },
                // { id:"", label:"", content: <></>},
            ]}
        />
    )
}


function EditForm({ product }: { product: Product }) {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const updateProductMutation = useUpdateProduct()
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

    return <ProductForm
        data={mapProductToFormData(product)}
        onEdit={handleEdit}
        submitLabel={"Guardar producto"}
        onSave={async () => { }} // No se necesita onSave en el detalle, pero se requiere para el tipo
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
        mainImage: product.main_image ?? "",
        isFeatured: product.is_featured,
        isOnSale: product.is_on_sale,
        isActive: product.is_active,
        description: product.description ?? "",
        images: [],
        mainImageIndex: 0,
    }
}