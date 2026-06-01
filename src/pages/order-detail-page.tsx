import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useOrderDetail, useCancelOrder } from '@/hooks/api/useOrders'
import { useSession } from '@/hooks/use-session'
import useTitle from '@/hooks/use-title'

function statusColor(status?: string) {
  const s = (status || '').toLowerCase()
  if (s === 'pending') return 'bg-amber-100 text-amber-800'
  if (s === 'invoiced') return 'bg-sky-100 text-sky-800'
  if (s === 'completed') return 'bg-emerald-100 text-emerald-800'
  if (s === 'cancelled' || s === 'cancelado') return 'bg-red-100 text-red-800'
  return 'bg-gray-100 text-gray-800'
}

function fmtMoney(v?: number) {
  return (v ?? 0).toFixed(2)
}

export default function OrderDetailPage() {
  useTitle('Detalle de pedido')
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const orderId = id ? Number(id) : undefined
  const orderQuery = useOrderDetail(orderId, { retry: false })
  const isAdmin = useSession((state) => state.hasRole('admin'))
  const cancelOrder = useCancelOrder()
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const order = orderQuery.data
  const canCancel = !!order && (order.status?.toLowerCase() !== 'cancelled' && order.status?.toLowerCase() !== 'cancelado')

  useEffect(() => {
    if (!orderQuery.isLoading && orderQuery.error) {
      const status =
        (orderQuery.error as any)?.status ||
        (orderQuery.error as any)?.payload?.status_code ||
        (orderQuery.error as any)?.response?.status
      if (status === 401 || status === 403) {
        navigate('/', { replace: true })
      }
    }
  }, [orderQuery.isLoading, orderQuery.error, navigate])

  const billingSnapshot = useMemo(() => order?.billing_data_snapshot ?? null, [order])

  if (!orderId) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold">Pedido inválido</h1>
              <p className="text-sm text-slate-500">No se pudo cargar el pedido solicitado.</p>
            </div>
            <Button variant="outline" onClick={() => navigate('/')}>Volver al inicio</Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Detalle del pedido</h1>
            <p className="text-sm text-slate-500">Visualiza el estado, artículos y datos de facturación del pedido.</p>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <Button variant="outline" onClick={() => navigate(-1)}>Regresar</Button>
            {isAdmin && (
              <>
                <Button variant="secondary" asChild>
                  <a href={`/api/orders/${orderId}/invoice/`} target="_blank" rel="noreferrer">Descargar factura</a>
                </Button>
                <Button variant="destructive" onClick={async () => {
                  if (!orderId) return
                  setStatusMessage(null)
                  setErrorMessage(null)
                  try {
                    await cancelOrder.mutateAsync(orderId)
                    setStatusMessage('Pedido cancelado correctamente.')
                    // refetch
                    orderQuery.refetch()
                  } catch (err) {
                    setErrorMessage('No se pudo cancelar el pedido.')
                  }
                }} disabled={!canCancel || cancelOrder.isLoading}>
                  {cancelOrder.isLoading ? 'Cancelando...' : 'Cancelar pedido'}
                </Button>
              </>
            )}
          </div>
        </div>

        {orderQuery.isLoading ? (
          <Card>
            <CardContent>Cargando pedido...</CardContent>
          </Card>
        ) : orderQuery.error ? (
          <Card>
            <CardContent>Error cargando el pedido.</CardContent>
          </Card>
        ) : !orderQuery.data ? (
          <Card>
            <CardContent>
              <p className="text-sm text-slate-500">No se encontró el pedido solicitado.</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Pedido #{order?.id}</CardTitle>
                  <CardDescription className="capitalize">{order?.status}</CardDescription>
                </div>
                <div className={`rounded-full px-3 py-1 text-sm font-medium ${statusColor(order?.status)}`}>
                  {order?.status}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium">Método de pago</p>
                  <p>{order?.payment_method ?? 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Total</p>
                  <p>${fmtMoney(order?.total)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Estado</p>
                  <p className="capitalize">{order?.status}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Fecha</p>
                  <p>{order?.created_at ?? 'No disponible'}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium">Cliente</p>
                  <p>{orderQuery.data.customer_name ?? 'N/A'}</p>
                  <p className="text-sm text-slate-600">{orderQuery.data.customer_phone ?? 'N/A'}</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium">Perfil de facturación</p>
                  {billingSnapshot ? (
                    <div className="space-y-1 text-sm text-slate-700">
                      <p className="font-medium">{billingSnapshot.full_name}</p>
                      <p>{billingSnapshot.address_line1}</p>
                      <p>RIF: {billingSnapshot.rif}</p>
                      {billingSnapshot.phone && <p>Tel: {billingSnapshot.phone}</p>}
                      {isAdmin && order?.user_id && <p className="text-xs text-slate-500">Usuario ID: {order.user_id}</p>}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">No hay datos de facturación disponibles.</p>
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium">Artículos</p>
                <div className="mt-4 space-y-3">
                  {order?.items.map((item) => (
                    <div key={item.id} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-[1fr_auto]">
                      <div>
                        <p className="font-medium">{item.product?.name ?? 'Producto eliminado'}</p>
                        <p className="text-sm text-slate-600">Cantidad: {item.quantity} · Precio unitario: ${fmtMoney(item.price)}</p>
                        {isAdmin && item.product && <p className="text-xs text-slate-500">SKU: {item.product.sku ?? 'N/A'}</p>}
                      </div>
                      <p className="text-right font-semibold">${fmtMoney(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>
              {(statusMessage || errorMessage) && (
                <div>
                  {statusMessage && <p className="text-sm text-emerald-600">{statusMessage}</p>}
                  {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
