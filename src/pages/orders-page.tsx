import { useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useTitle from '@/hooks/use-title'
import { useOrders } from '@/hooks/api/useOrders'
import { useSession } from '@/hooks/use-session'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ShoppingBag,
  Package,
  ChevronRight,
  Search,
  Clock,
  CheckCircle2,
  CreditCard,
  XCircle,
} from 'lucide-react'
import { MultiHostImage } from '@/components/own/multi-host-image';

const ORDER_STATUSES = [
  { value: 'all', label: 'Todos' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'invoiced', label: 'Facturados' },
  { value: 'completed', label: 'Completados' },
  { value: 'cancelled', label: 'Cancelados' },
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

function fmtDate(value?: string | null) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function fmtMoney(v?: number) {
  return (v ?? 0).toFixed(2)
}

export default function OrdersPage() {
  useTitle('Mis pedidos')
  const navigate = useNavigate()
  const user = useSession((s) => s.user)
  const { data, isLoading, pagination, params } = useOrders()

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true })
    }
  }, [user, navigate])

  const statusSummary = useMemo(() => {
    const all = data?.items || []
    return {
      total: all.length,
      pending: all.filter((o) => normalizeStatus(o.status) === 'pending').length,
      completed: all.filter((o) => normalizeStatus(o.status) === 'completed').length,
      cancelled: all.filter((o) => ['cancelled', 'cancelado'].includes(normalizeStatus(o.status))).length,
    }
  }, [data?.items])

  const currentStatusLabel = useMemo(() => {
    return ORDER_STATUSES.find((s) => s.value === (params.status || 'all'))?.label || 'Todos'
  }, [params.status])

  if (!user) return null

  return (
    <main className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Mis pedidos</h1>
          <p className="text-sm text-muted-foreground">Revisa el estado y los detalles de todas tus compras.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border/70">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ShoppingBag className="size-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total pedidos</p>
                <p className="text-xl font-bold">{statusSummary.total}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/70">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Clock className="size-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pendientes</p>
                <p className="text-xl font-bold">{statusSummary.pending}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/70">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Completados</p>
                <p className="text-xl font-bold">{statusSummary.completed}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/70">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex size-9 items-center justify-center rounded-lg bg-red-500/10 text-red-600 dark:text-red-400">
                <XCircle className="size-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Cancelados</p>
                <p className="text-xl font-bold">{statusSummary.cancelled}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-muted/40 p-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={params.q}
              onChange={(e) => params.setQ(e.target.value)}
              placeholder="Buscar por número, producto o estado"
              className="pl-9 bg-background"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Estado:</span>
            <Select value={params.status || 'all'} onValueChange={(v) => params.setStatus(v === 'all' ? '' : v)}>
              <SelectTrigger className="w-[160px] bg-background">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                {ORDER_STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {params.status && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            Mostrando pedidos
            <Badge variant="secondary" className="font-normal">
              {currentStatusLabel}
            </Badge>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-2xl" />
            ))}
          </div>
        ) : data?.items?.length ? (
          <div className="space-y-4">
            {data.items.map((order) => {
              const cfg = statusConfig(order.status)
              const StatusIcon = cfg.icon
              return (
                <Link key={order.id} to={`/orders/${order.id}`} className="block">
                  <Card className="rounded-2xl border-border bg-card shadow-sm hover:shadow-md transition-all hover:border-primary/30 group cursor-pointer">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-3 flex-1 min-w-0">
                          <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex items-center gap-2 min-w-0">
                              <Package className="size-5 text-primary shrink-0" />
                              <h3 className="font-bold text-foreground text-lg truncate">
                                Pedido #{order.id}
                              </h3>
                            </div>
                            <Badge variant={cfg.variant as any} className="gap-1 capitalize">
                              <StatusIcon className="size-3" />
                              {cfg.label}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Fecha</p>
                              <p className="font-medium text-foreground">{fmtDate(order.created_at)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Total</p>
                              <p className="font-bold text-foreground text-base">${fmtMoney(order.total)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Artículos</p>
                              <p className="font-medium text-foreground">{order.items?.length || 0} productos</p>
                            </div>
                          </div>

                          {order.items && order.items.length > 0 && (
                            <div className="flex -space-x-2">
                              {order.items.slice(0, 4).map((item) => (
                                <div
                                  key={item.id}
                                  className="size-8 rounded-full border-2 border-background bg-muted overflow-hidden"
                                >
                                  {item.product?.main_image ? (
                                    <MultiHostImage path={item.product.main_image} alt="" className="size-full object-cover" />
                                  ) : (
                                    <div className="size-full flex items-center justify-center text-xs text-muted-foreground font-bold">
                                      {item.product?.name?.charAt(0) || '?'}
                                    </div>
                                  )}
                                </div>
                              ))}
                              {order.items.length > 4 && (
                                <div className="size-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                                  +{order.items.length - 4}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <ChevronRight className="size-5 text-muted-foreground/40 group-hover:text-primary transition-colors mt-2" />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            asChild
                          >
                            <span>Ver detalle</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}

            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => pagination.prevPage()}
                >
                  Anterior
                </Button>
                <span className="text-sm text-muted-foreground">
                  Página {pagination.page} de {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => pagination.nextPage()}
                >
                  Siguiente
                </Button>
              </div>
            )}
          </div>
        ) : (
          <Card className="rounded-2xl border-dashed border-border">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <ShoppingBag className="size-12 text-muted-foreground/30 mb-4" />
              <h2 className="text-lg font-semibold text-foreground">No tienes pedidos</h2>
              <p className="text-sm text-muted-foreground mt-1">Tus compras aparecerán aquí.</p>
              <Button className="mt-4" onClick={() => navigate('/shop')}>
                Ir a la tienda
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
