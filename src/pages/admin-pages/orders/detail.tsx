import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { toast } from "sonner"
import { showApiError } from "@/api/index"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useOrderDetail, useCancelOrder, useUpdateOrderStatus } from "@/hooks/api/useOrders"
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  User,
  Phone,
  MapPin,
  FileText,
  Printer,
  Package,
  XCircle,
  RefreshCcw,
  CheckCircle2,
  Clock,
  DollarSign,
  ShoppingBag,
} from "lucide-react"

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

export default function OrdersAdminDetail() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const orderId = id ? Number(id) : undefined
  const { data: order, isLoading, error, refetch } = useOrderDetail(orderId)
  const cancelOrder = useCancelOrder()
  const updateStatus = useUpdateOrderStatus()
  const [statusValue, setStatusValue] = useState(order?.status || '')

  useEffect(() => {
    if (order?.status) setStatusValue(order.status)
  }, [order?.status])

  const canCancel = order && !['cancelled', 'cancelado'].includes(normalizeStatus(order.status))
  const canUpdateStatus = order && !['cancelled', 'cancelado'].includes(normalizeStatus(order.status))

  const handleCancel = async () => {
    if (!orderId) return
    try {
      await cancelOrder.mutateAsync(orderId)
      toast.success('Pedido cancelado correctamente.')
      refetch()
    } catch (cancelError) {
      showApiError(cancelError, 'No se pudo cancelar el pedido')
    }
  }

  const handleStatusChange = async (value: string) => {
    if (!orderId || value === order?.status) return
    try {
      await updateStatus.mutateAsync({ orderId, payload: { status: value } })
      toast.success('Estado del pedido actualizado.')
      refetch()
    } catch (err) {
      showApiError(err, 'No se pudo actualizar el estado')
    }
  }

  const billingSnapshot = useMemo(() => order?.billing_data_snapshot ?? null, [order])
  const cfg = statusConfig(order?.status)
  const StatusIcon = cfg.icon

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link to="/admin/orders" className="hover:text-foreground transition-colors">Pedidos</Link>
            <span>/</span>
            <span>Detalle</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Detalle de pedido</h1>
          <p className="text-sm text-muted-foreground">Visualiza y gestiona la información completa de este pedido.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => navigate('/admin/orders')}>
            <ArrowLeft className="size-4 mr-2" />
            Volver
          </Button>
          <Button variant="secondary" asChild>
            <a href={`/api/orders/${orderId}/invoice/`} target="_blank" rel="noreferrer">
              <FileText className="size-4 mr-2" />
              Factura
            </a>
          </Button>
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="size-4 mr-2" />
            Imprimir
          </Button>
          {canCancel && (
            <Button variant="destructive" onClick={handleCancel} disabled={cancelOrder.isLoading}>
              <XCircle className="size-4 mr-2" />
              {cancelOrder.isLoading ? 'Cancelando...' : 'Cancelar pedido'}
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-6 space-y-3">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      ) : error ? (
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
        <Card className="border-border">
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <CardTitle className="text-2xl">Pedido #{order.id}</CardTitle>
                <Badge variant={cfg.variant} className="gap-1 capitalize text-sm">
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
                <p className="mt-1 text-xl font-bold text-foreground flex items-center gap-1">
                  <DollarSign className="size-5" />
                  {fmtMoney(order.total)}
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-muted/40 p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Estado</p>
                <p className="mt-1 font-medium text-foreground capitalize">{order.status}</p>
              </div>
              <div className="rounded-2xl border border-border bg-muted/40 p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Artículos</p>
                <p className="mt-1 font-medium text-foreground flex items-center gap-2">
                  <ShoppingBag className="size-4 text-primary" />
                  {order.items?.length || 0}
                </p>
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
                <p className="text-xs text-muted-foreground mt-2">Usuario ID: {order.user_id ?? 'Invitado'}</p>
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
                      <p className="text-xs text-muted-foreground">SKU: {item.product?.sku ?? 'N/D'}</p>
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
          </CardContent>
        </Card>
      )}
    </div>
  )
}
