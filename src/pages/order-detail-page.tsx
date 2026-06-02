import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useOrderDetail, useCancelOrder } from '@/hooks/api/useOrders'
import { useSession } from '@/hooks/use-session'
import { useSettings } from '@/hooks/api/useSettings'
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

/** Construye la URL de WhatsApp con el resumen de la orden */
function buildWhatsAppUrl(phone: string, order: any): string {
  const normalizedPhone = phone.replace(/\D/g, '')
  if (!normalizedPhone) return ''

  const lines: string[] = []
  lines.push(`📦 *Pedido #${order.id}*`)
  lines.push(`👤 Cliente: ${order.customer_name ?? 'N/A'}`)
  lines.push(`📞 Tel: ${order.customer_phone ?? '(sin teléfono)'}`)
  lines.push(`📋 Estado: ${order.status}`)
  lines.push('')
  lines.push('🛒 *Artículos:*')

  if (order.items?.length) {
    for (const item of order.items) {
      const name = item.product?.name ?? 'Producto eliminado'
      lines.push(`  • ${item.quantity} x ${name} — $${fmtMoney(item.price)}`)
    }
  }

  lines.push('')
  lines.push(`💰 *Total: $${fmtMoney(order.total)}*`)
  lines.push(`💳 Método de pago: ${order.payment_method ?? 'N/A'}`)

  if (order.billing_data_snapshot) {
    const snap = order.billing_data_snapshot
    lines.push('')
    lines.push('📄 *Datos de facturación:*')
    lines.push(`  Nombre: ${snap.full_name}`)
    if (snap.rif) lines.push(`  RIF: ${snap.rif}`)
    if (snap.address_line1) lines.push(`  Dirección: ${snap.address_line1}`)
  }

  lines.push('')
  const orderUrl = window.location.href
  lines.push(`🔗 Ver pedido: ${orderUrl}`)

  // QR code como imagen accesible via URL pública
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(orderUrl)}`
  lines.push('')
  lines.push(`📱 *Escanea el QR para ver el pedido:*`)
  lines.push(qrImageUrl)

  const text = encodeURIComponent(lines.join('\n'))
  return `https://wa.me/${normalizedPhone}?text=${text}`
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

export default function OrderDetailPage() {
  useTitle('Detalle de pedido')
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const orderId = id ? Number(id) : undefined
  const orderQuery = useOrderDetail(orderId, { retry: false })
  const isAdmin = useSession((state) => state.hasRole('admin'))
  const cancelOrder = useCancelOrder()
  const { data: settings } = useSettings()
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const order = orderQuery.data
  const canCancel = !!order && (order.status?.toLowerCase() !== 'cancelled' && order.status?.toLowerCase() !== 'cancelado')

  const whatsappUrl = useMemo(() => {
    if (!order || !settings?.order_whatsapp) return null
    return buildWhatsAppUrl(settings.order_whatsapp, order)
  }, [order, settings?.order_whatsapp])

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
            {whatsappUrl && (
              <Button
                asChild
                className="bg-[#25D366] hover:bg-[#1da851] text-white gap-2"
              >
                <a href={whatsappUrl} target="_blank" rel="noreferrer">
                  <WhatsAppIcon className="size-4" />
                  Enviar por WhatsApp
                </a>
              </Button>
            )}
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
              {/* Código QR del pedido */}
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                  <div className="flex flex-col items-center gap-3">
                    <div className="rounded-2xl border-2 border-white bg-white p-3 shadow-sm">
                      <QRCodeSVG
                        value={window.location.href}
                        size={140}
                        level="M"
                        marginSize={0}
                        fgColor="#1e293b"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
                    <p className="text-sm font-medium">Código QR del pedido</p>
                    <p className="mt-1 text-sm text-slate-500">Escanea este código QR para acceder directamente al detalle de este pedido desde cualquier dispositivo.</p>
                    <p className="mt-2 max-w-xs truncate rounded-lg bg-white px-3 py-1.5 text-xs font-mono text-slate-500 border border-slate-200">{window.location.href}</p>
                  </div>
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
