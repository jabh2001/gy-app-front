import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useOrders } from "@/hooks/api/useOrders"

export default function OrdersAdminIndex() {
  const navigate = useNavigate()
  const { data, isLoading, error, params, pagination } = useOrders()
  const orders = useMemo(() => data?.items ?? [], [data])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Pedidos</h1>
          <p className="text-sm text-muted-foreground">Controla los pedidos y su estado.</p>
        </div>
      </div>

      <div className="grid gap-4 rounded-3xl border border-border/70 bg-muted p-4 md:grid-cols-[1fr_auto]">
        <label className="grid gap-2">
          <span className="text-sm font-medium">Buscar</span>
          <Input
            value={params.q}
            onChange={(event) => params.setQ(event.target.value)}
            placeholder="Buscar pedido, cliente o estado"
          />
        </label>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl border border-border/70 bg-background px-4 py-3 text-sm text-muted-foreground">
            {pagination.resultsText}
          </div>
          <div className="rounded-xl border border-border/70 bg-background px-4 py-3 text-sm text-muted-foreground">
            {pagination.paginationText}
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {isLoading ? (
          <Card>
            <CardContent>Cargando pedidos...</CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent>Error cargando pedidos.</CardContent>
          </Card>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent>No se encontraron pedidos.</CardContent>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id} className="space-y-4">
              <CardHeader>
                <CardTitle>Pedido #{order.id}</CardTitle>
                <CardDescription>{order.status}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                <div className="text-sm text-muted-foreground">Total: ${order.total.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Pago: {order.payment_method ?? 'N/A'}</div>
                <div className="text-sm text-muted-foreground">Artículos: {order.items.length}</div>
              </CardContent>
              <div className="flex flex-wrap items-center gap-2 px-4 pb-4">
                <Button variant="secondary" size="sm" onClick={() => navigate(`detail/${order.id}`)}>
                  Ver detalle
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-border/70 bg-white p-4">
        <div className="text-sm text-slate-600">{pagination.resultsText}</div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={pagination.prevPage} disabled={!pagination.canPrevPage}>
            Anterior
          </Button>
          <Button size="sm" variant="outline" onClick={pagination.nextPage} disabled={!pagination.canNextPage}>
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}
