import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import OrderForm, { type OrderFormData } from "@/components/own/forms/order-form"

const initialOrders: OrderFormData[] = [
  { id: 1, orderNumber: "#1001", customer: "Lucía Gómez", total: "120.00", status: "Pendiente" },
  { id: 2, orderNumber: "#1002", customer: "Juan Pérez", total: "78.50", status: "Enviado" },
]

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderFormData[]>(initialOrders)
  const [selectedOrder, setSelectedOrder] = useState<OrderFormData | undefined>(undefined)
  const [editing, setEditing] = useState(false)

  const rows = useMemo(
    () =>
      orders.map((order) => (
        <tr key={order.id} className="border-b border-border/60">
          <td className="px-4 py-3 text-sm text-foreground">{order.orderNumber}</td>
          <td className="px-4 py-3 text-sm text-muted-foreground">{order.customer}</td>
          <td className="px-4 py-3 text-sm text-foreground">${order.total}</td>
          <td className="px-4 py-3 text-sm text-muted-foreground">{order.status}</td>
          <td className="px-4 py-3 text-right">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedOrder(order)
                setEditing(true)
              }}
            >
              Editar
            </Button>
          </td>
        </tr>
      )),
    [orders]
  )

  const handleSave = (order: OrderFormData) => {
    setOrders((prev) => [
      ...prev,
      { ...order, id: prev.length ? Math.max(...prev.map((item) => item.id || 0)) + 1 : 1 },
    ])
    setSelectedOrder(undefined)
    setEditing(false)
  }

  const handleEdit = (updated: OrderFormData) => {
    setOrders((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
    setSelectedOrder(undefined)
    setEditing(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Pedidos</h1>
          <p className="text-sm text-muted-foreground">Controla los pedidos y su flujo de pago/entrega.</p>
        </div>
        <Button onClick={() => { setSelectedOrder(undefined); setEditing(true) }}>Nuevo pedido</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pedidos recientes</CardTitle>
          <CardDescription>Actualiza el estado y consulta el historial de ventas.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
            <thead className="border-b border-border/70 text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Pedido</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>
        </CardContent>
      </Card>

      {editing ? (
        <OrderForm data={selectedOrder} onSave={handleSave} onEdit={handleEdit} />
      ) : null}
    </div>
  )
}
