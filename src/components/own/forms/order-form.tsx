import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import AdminForm from "./admin-form"

export interface OrderFormData {
  id?: number
  orderNumber: string
  customer: string
  total: string
  status: string
}

interface OrderFormProps {
  data?: OrderFormData
  onSave: (order: OrderFormData) => void
  onEdit: (order: OrderFormData) => void
  submitLabel?: string
}

export default function OrderForm({ data, onSave, onEdit, submitLabel = "Guardar pedido" }: OrderFormProps) {
  const [formState, setFormState] = useState<OrderFormData>({
    orderNumber: "",
    customer: "",
    total: "",
    status: "Pendiente",
  })

  useEffect(() => {
    if (data) {
      setFormState(data)
    }
  }, [data])

  const handleChange = (key: keyof OrderFormData, value: string) => {
    setFormState((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = () => {
    if (data?.id) {
      onEdit(formState)
      return
    }
    onSave(formState)
    setFormState({ orderNumber: "", customer: "", total: "", status: "Pendiente" })
  }

  return (
    <AdminForm
      title={data ? "Editar pedido" : "Nuevo pedido"}
      description="Registra pedidos y actualiza su estado conforme avanzan."
      submitLabel={submitLabel}
      submitLabelOnEdit="Actualizar pedido"
      isEditing={Boolean(data)}
      onSubmit={handleSubmit}
    >
      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium">
          Número de pedido
          <Input
            value={formState.orderNumber}
            onChange={(event) => handleChange("orderNumber", event.target.value)}
            placeholder="#12345"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Cliente
          <Input
            value={formState.customer}
            onChange={(event) => handleChange("customer", event.target.value)}
            placeholder="Ana Pérez"
          />
        </label>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium">
          Total
          <Input
            value={formState.total}
            onChange={(event) => handleChange("total", event.target.value)}
            placeholder="199.90"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Estado
          <Input
            value={formState.status}
            onChange={(event) => handleChange("status", event.target.value)}
            placeholder="Pendiente / Enviado / Completado"
          />
        </label>
      </div>
    </AdminForm>
  )
}
