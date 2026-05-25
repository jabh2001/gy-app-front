import { useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import OrderForm from "@/components/own/forms/order-form"
import type { OrderFormData } from "@/components/own/forms/order-form"

const mockOrders: OrderFormData[] = [
  { id: 1, orderNumber: "#1001", customer: "Lucía Gómez", total: "120.00", status: "Pendiente" },
  { id: 2, orderNumber: "#1002", customer: "Juan Pérez", total: "78.50", status: "Enviado" },
]

export default function OrdersAdminForm() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const editing = Boolean(id)

  const selectedOrder = useMemo(
    () => mockOrders.find((order) => order.id === Number(id)),
    [id]
  )

  const handleSave = () => {
    navigate(-1)
  }

  const handleEdit = () => {
    navigate(-1)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            {editing ? "Editar pedido" : "Crear pedido"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Completa los datos para {editing ? "actualizar" : "agregar"} un pedido.
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Regresar
        </Button>
      </div>

      <OrderForm data={selectedOrder} onSave={handleSave} onEdit={handleEdit} submitLabel="Guardar pedido" />
    </div>
  )
}
