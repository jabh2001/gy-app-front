import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useOrderDetail, useCancelOrder } from "@/hooks/api/useOrders"

export default function OrdersAdminDetail() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const orderId = id ? Number(id) : undefined
  const { data: order, isLoading, error } = useOrderDetail(orderId)
  const cancelOrder = useCancelOrder()

  const canCancel = order && order.status && order.status.toLowerCase() !== 'cancelado'

  const handleCancel = async () => {
    if (!orderId) return
    setStatusMessage(null)
    setErrorMessage(null)
    try {
      await cancelOrder.mutateAsync(orderId)
      setStatusMessage('Pedido cancelado correctamente.')
    } catch (cancelError) {
      setErrorMessage('No se pudo cancelar el pedido.')
    }
  }

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

      {isLoading ? (
        <Card>
          <CardContent>Cargando pedido...</CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent>Error cargando el pedido.</CardContent>
        </Card>
      ) : !order ? (
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">No se encontró el pedido solicitado.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Pedido #{order.id}</CardTitle>
            <CardDescription>{order.status}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium">Método de pago</p>
                <p className="text-foreground">{order.payment_method ?? 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Total</p>
                <p className="text-foreground">${order.total.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Estado</p>
                <p className="text-foreground">{order.status}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Fecha</p>
                <p className="text-foreground">{order.created_at ?? 'No disponible'}</p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium">Items</p>
              <div className="mt-3 space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-3 sm:grid-cols-[1fr_auto]">
                    <div>
                      <p className="font-medium">{item.product?.name ?? 'Producto eliminado'}</p>
                      <p className="text-sm text-slate-600">Cantidad: {item.quantity}</p>
                    </div>
                    <p className="text-right font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {statusMessage && <p className="text-sm text-emerald-600">{statusMessage}</p>}
            {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" onClick={() => navigate(-1)}>
                Volver
              </Button>
              <Button variant="destructive" onClick={handleCancel} disabled={!canCancel || cancelOrder.isLoading}>
                {cancelOrder.isLoading ? 'Cancelando...' : 'Cancelar pedido'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
