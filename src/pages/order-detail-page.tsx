import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { QRCodeSVG } from 'qrcode.react'
import { showApiError } from '@/api/index'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useOrderDetail, useCancelOrder, useUpdateOrderStatus } from '@/hooks/api/useOrders'
import { useSession } from '@/hooks/use-session'
import { useSettings } from '@/hooks/api/useSettings'
import useTitle from '@/hooks/use-title'
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  User,
  Phone,
  MapPin,
  Package,
  XCircle,
  RefreshCcw,
  Truck,
  CheckCircle2,
  Clock,
  RotateCcw,
} from 'lucide-react'

const ORDER_STATUSES = [
  { value: 'pending', label: 'Pendiente', icon: Clock },
  { value: 'invoiced', label: 'Facturado', icon: CreditCard },
  { value: 'completed', label: 'Completado', icon: CheckCircle2 },
  { value: 'cancelled', label: 'Cancelado', icon: XCircle },
]

function normalizeStatus(status?: string) {
  return (status || '').toLowerCase()
}

function statusConfig(status?: string) {
  const s = normalizeStatus(status)
  switch (s) {
    case 'pending':
      return { label: 'Pendiente', variant: 'warning' as const, icon: Clock }
    case 'invoiced':
      return { label: 'Facturado', variant: 'info' as const, icon: CreditCard }
    case 'completed':
      return { label: 'Completado', variant: 'success' as const, icon: CheckCircle2 }
    case 'cancelled':
    case 'cancelado':
      return { label: 'Cancelado', variant: 'destructive' as const, icon: XCircle }
    default:
      return { label: status || 'Desconocido', variant: 'secondary' as const, icon: Package }
  }
}

function fmtMoney(v?: number) {
  return (v ?? 0).toFixed(2)
}

function fmtDate(value?: string | null) {
  if (!value) return 'No disponible'
  return new Date(value).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

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
  const user = useSession((state) => state.user)
  const isAdmin = useSession((state) => state.hasRole('admin'))
  const cancelOrder = useCancelOrder()
  const updateStatus = useUpdateOrderStatus()
  const { data: settings } = useSettings()
  const order = orderQuery.data
  const [statusValue, setStatusValue] = useState(order?.status || '')

  useEffect(() => {
    if (order?.status) setStatusValue(order.status)
  }, [order?.status])

  const canCancel = !!order && !['cancelled', 'cancelado', 'completed', 'invoiced'].includes(normalizeStatus(order.status))
  const canUpdateStatus = isAdmin && !!order && !['cancelled', 'cancelado'].includes(normalizeStatus(order.status))

  const whatsappUrl = useMemo(() => {
    if (!order || !settings?.order_whatsapp || settings.order_whatsapp != "pending") return null
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

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true })
    }
  }, [user, navigate])

  const handleCancel = async () => {
    if (!orderId) return
    try {
      await cancelOrder.mutateAsync(orderId)
      toast.success('Pedido cancelado correctamente.')
      orderQuery.refetch()
    } catch (err) {
      showApiError(err, 'No se pudo cancelar el pedido')
    }
  }

  const handleStatusChange = async (value: string) => {
    if (!orderId || value === order?.status) return
    try {
      await updateStatus.mutateAsync({ orderId, payload: { status: value } })
      toast.success('Estado del pedido actualizado.')
      orderQuery.refetch()
    } catch (err) {
      showApiError(err, 'No se pudo actualizar el estado')
    }
  }

  const billingSnapshot = useMemo(() => order?.billing_data_snapshot ?? null, [order])
  const cfg = statusConfig(order?.status)
  const StatusIcon = cfg.icon

  if (!orderId) {
    return (
      <main className="min-h-screen bg-background px-4 py-8">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold">Pedido inválido</h1>
              <p className="text-sm text-muted-foreground">No se pudo cargar el pedido solicitado.</p>
            </div>
            <Button variant="outline" onClick={() => navigate('/orders')}>
              Volver a pedidos
            </Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Link to="/orders" className="hover:text-foreground transition-colors">Mis pedidos</Link>
              <span>/</span>
              <span>Detalle</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">Pedido #{order?.id}</h1>
            <p className="text-sm text-muted-foreground">Visualiza el estado, artículos y datos de facturación.</p>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <Button variant="outline" onClick={() => navigate('/orders')}>
              <ArrowLeft className="size-4 mr-2" />
              Volver
            </Button>
            {whatsappUrl && (
              <Button asChild className="bg-[#25D366] hover:bg-[#1da851] text-white gap-2">
                <a href={whatsappUrl} target="_blank" rel="noreferrer">
                  <WhatsAppIcon className="size-4" />
                  Enviar por WhatsApp
                </a>
              </Button>
            )}
            {/* <Button variant="secondary" asChild>
              <a href={`/api/orders/${orderId}/invoice/`} target="_blank" rel="noreferrer">
                <FileText className="size-4 mr-2" />
                Factura
              </a>
            </Button>
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="size-4 mr-2" />
              Imprimir
            </Button> */}
            {canCancel && (
              <Button
                variant="destructive"
                onClick={handleCancel}
                disabled={cancelOrder.isLoading}
              >
                <XCircle className="size-4 mr-2" />
                {cancelOrder.isLoading ? 'Cancelando...' : 'Cancelar pedido'}
              </Button>
            )}
          </div>
        </div>

        {orderQuery.isLoading ? (
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-8 w-1/3 mb-4" />
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        ) : orderQuery.error ? (
          <Card className="border-destructive/50">
            <CardContent className="p-6 text-destructive">Error cargando el pedido.</CardContent>
          </Card>
        ) : !order ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">No se encontró el pedido solicitado.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="border-border">
              <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-2xl">Pedido #{order.id}</CardTitle>
                    <Badge variant={cfg.variant as any} className="gap-1 capitalize text-sm">
                      <StatusIcon className="size-3.5" />
                      {cfg.label}
                    </Badge>
                  </div>
                  {canUpdateStatus && (
                    <div className="flex items-center gap-2">
                      <RefreshCcw className="size-4 text-muted-foreground" />
                      <Select value={statusValue} onValueChange={handleStatusChange} disabled={updateStatus.isLoading}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Cambiar estado" />
                        </SelectTrigger>
                        <SelectContent>
                          {ORDER_STATUSES.map((s) => (
                            <SelectItem key={s.value} value={s.value}>
                              <span className="flex items-center gap-2">
                                <s.icon className="size-3.5" />
                                {s.label}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                <CardDescription className="flex items-center gap-2 mt-2">
                  <Calendar className="size-3.5" />
                  Creado el {fmtDate(order.created_at)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-2xl border border-border bg-muted/40 p-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Método de pago</p>
                    <p className="mt-1 font-medium text-foreground flex items-center gap-2">
                      <CreditCard className="size-4 text-primary" />
                      {order.payment_method ?? 'N/D'}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-muted/40 p-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Total</p>
                    <p className="mt-1 text-xl font-bold text-foreground">${fmtMoney(order.total)}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-muted/40 p-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Estado</p>
                    <p className="mt-1 font-medium text-foreground capitalize">{order.status}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-muted/40 p-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Artículos</p>
                    <p className="mt-1 font-medium text-foreground">{order.items?.length || 0}</p>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-muted/30 p-4">
                    <p className="text-sm font-medium flex items-center gap-2 mb-2">
                      <User className="size-4 text-primary" />
                      Cliente
                    </p>
                    <p className="font-medium text-foreground">{order.customer_name ?? 'N/D'}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <Phone className="size-3.5" />
                      {order.customer_phone ?? 'N/D'}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-muted/30 p-4">
                    <p className="text-sm font-medium flex items-center gap-2 mb-2">
                      <MapPin className="size-4 text-primary" />
                      Perfil de facturación
                    </p>
                    {billingSnapshot ? (
                      <div className="space-y-1 text-sm text-foreground">
                        <p className="font-medium">{billingSnapshot.full_name}</p>
                        <p className="text-muted-foreground">{billingSnapshot.address_line1}</p>
                        <p className="text-muted-foreground">RIF: {billingSnapshot.rif}</p>
                        {billingSnapshot.phone && <p className="text-muted-foreground">Tel: {billingSnapshot.phone}</p>}
                        {isAdmin && order?.user_id && <p className="text-xs text-muted-foreground mt-2">Usuario ID: {order.user_id}</p>}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No hay datos de facturación disponibles.</p>
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium flex items-center gap-2 mb-4">
                    <Package className="size-4 text-primary" />
                    Artículos
                  </p>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-[auto_1fr_auto] items-center"
                      >
                        <div className="size-12 rounded-xl border border-border bg-muted overflow-hidden shrink-0">
                          {item.product?.main_image_url_path ? (
                            <img
                              src={item.product.main_image_url_path}
                              alt={item.product.name}
                              className="size-full object-cover"
                            />
                          ) : (
                            <div className="size-full flex items-center justify-center text-xs font-bold text-muted-foreground">
                              {item.product?.name?.charAt(0) || '?'}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{item.product?.name ?? 'Producto eliminado'}</p>
                          <p className="text-sm text-muted-foreground">
                            Cantidad: {item.quantity} · Precio unitario: ${fmtMoney(item.price)}
                          </p>
                          {isAdmin && item.product && (
                            <p className="text-xs text-muted-foreground">SKU: {item.product.sku ?? 'N/D'}</p>
                          )}
                        </div>
                        <p className="text-right font-semibold text-foreground">${fmtMoney(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between rounded-2xl border border-border bg-muted/40 p-4">
                    <span className="text-sm text-muted-foreground">Subtotal</span>
                    <span className="font-semibold text-foreground">${fmtMoney(order.total)}</span>
                  </div>
                </div>

                <Separator />

                <div className="rounded-2xl border border-border bg-muted/30 p-4">
                  <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                    <div className="rounded-2xl border border-border bg-background p-3 shadow-sm">
                      <QRCodeSVG
                        value={window.location.href}
                        size={140}
                        level="M"
                        marginSize={0}
                        fgColor="hsl(var(--foreground))"
                        bgColor="hsl(var(--background))"
                      />
                    </div>
                    <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
                      <p className="text-sm font-medium text-foreground">Código QR del pedido</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Escanea este código QR para acceder directamente al detalle de este pedido desde cualquier dispositivo.
                      </p>
                      <p className="mt-2 max-w-xs truncate rounded-lg bg-background px-3 py-1.5 text-xs font-mono text-muted-foreground border border-border">
                        {window.location.href}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-3 print:hidden">
              <Button variant="outline" onClick={() => navigate('/shop')}>
                <Truck className="size-4 mr-2" />
                Seguir comprando
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                <RotateCcw className="size-4 mr-2" />
                Recargar
              </Button>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
