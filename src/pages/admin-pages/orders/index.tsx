import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { OrderFormData } from "@/components/own/forms/order-form"

const mockOrders: OrderFormData[] = [
  { id: 1, orderNumber: "#1001", customer: "Lucía Gómez", total: "120.00", status: "Pendiente" },
  { id: 2, orderNumber: "#1002", customer: "Juan Pérez", total: "78.50", status: "Enviado" },
]

export default function OrdersAdminIndex() {
  const [query, setQuery] = useState("")
  const navigate = useNavigate()

  const filteredOrders = useMemo(
    () =>
      mockOrders.filter((order) =>
        [order.orderNumber, order.customer, order.status].some((value) =>
          value.toLowerCase().includes(query.toLowerCase())
        )
      ),
    [query]
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Pedidos</h1>
          <p className="text-sm text-muted-foreground">Controla los pedidos y su estado de envío.</p>
        </div>
        <Button onClick={() => navigate("create")}>Crear pedido</Button>
      </div>

      <div className="grid gap-4 rounded-3xl border border-border/70 bg-muted p-4 md:grid-cols-[1fr_auto]">
        <label className="grid gap-2">
          <span className="text-sm font-medium">Buscar</span>
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar pedido, cliente o estado"
          />
        </label>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl border border-border/70 bg-background px-4 py-3 text-sm text-muted-foreground">
            Espacio para filtros
          </div>
          <div className="rounded-xl border border-border/70 bg-background px-4 py-3 text-sm text-muted-foreground">
            Ordenar y refinamiento
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="space-y-4">
            <CardHeader>
              <CardTitle>{order.orderNumber}</CardTitle>
              <CardDescription>{order.customer}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <div className="text-sm text-muted-foreground">Total: ${order.total}</div>
              <div className="text-sm text-muted-foreground">Estado: {order.status}</div>
            </CardContent>
            <div className="flex flex-wrap items-center gap-2 px-4 pb-4">
              <Button variant="outline" size="sm" onClick={() => navigate(`edit/${order.id}`)}>
                Editar
              </Button>
              <Button variant="secondary" size="sm" onClick={() => navigate(`detail/${order.id}`)}>
                Ver detalle
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
