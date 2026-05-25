import { useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { OrderFormData } from "@/components/own/forms/order-form"

const mockOrders: OrderFormData[] = [
  { id: 1, orderNumber: "#1001", customer: "Lucía Gómez", total: "120.00", status: "Pendiente" },
  { id: 2, orderNumber: "#1002", customer: "Juan Pérez", total: "78.50", status: "Enviado" },
]

export default function OrdersAdminDetail() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const order = useMemo(
    () => mockOrders.find((item) => item.id === Number(id)),
    [id]
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Detalle de pedido</h1>
          <p className="text-sm text-muted-foreground">Visualiza la información completa de este pedido.</p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Regresar
        </Button>
      </div>

      {order ? (
        <Card>
          <CardHeader>
            <CardTitle>{order.orderNumber}</CardTitle>
            <CardDescription>{order.customer}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium">Cliente</p>
              <p className="text-foreground">{order.customer}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Total</p>
              <p className="text-foreground">${order.total}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Estado</p>
              <p className="text-foreground">{order.status}</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">No se encontró el pedido solicitado.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
