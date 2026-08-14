import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useOrders, useOrdersStats } from "@/hooks/api/useOrders"
import {
  Search,
  Eye,
  FileText,
  XCircle,
  Package,
  Clock,
  CheckCircle2,
  CreditCard,
  DollarSign,
  ShoppingBag,
} from "lucide-react"

const ORDER_STATUSES = [
  { value: 'all', label: 'Todos' },
  { value: 'pending', label: 'Pendiente' },
  { value: 'invoiced', label: 'Facturado' },
  { value: 'completed', label: 'Completado' },
  { value: 'cancelled', label: 'Cancelado' },
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
    month: 'short',
    day: 'numeric',
  })
}

function fmtMoney(v?: number) {
  return (v ?? 0).toFixed(2)
}

export default function OrdersAdminIndex() {
  const navigate = useNavigate()
  const { data, isLoading, error, params, pagination } = useOrders()
  const { data: stats, isLoading: statsLoading } = useOrdersStats()
  const orders = useMemo(() => data?.items ?? [], [data])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Pedidos</h1>
          <p className="text-sm text-muted-foreground">Controla los pedidos, estados y facturas.</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/70">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShoppingBag className="size-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total pedidos</p>
              <p className="text-xl font-bold">{statsLoading ? '—' : stats?.total_orders ?? 0}</p>
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
              <p className="text-xl font-bold">{statsLoading ? '—' : stats?.counts?.pending ?? 0}</p>
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
              <p className="text-xl font-bold">{statsLoading ? '—' : stats?.counts?.completed ?? 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/70">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-9 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <DollarSign className="size-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Ingresos</p>
              <p className="text-xl font-bold">${statsLoading ? '—' : fmtMoney(stats?.total_revenue)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-muted/40 p-3 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={params.q}
            onChange={(event) => params.setQ(event.target.value)}
            placeholder="Buscar por ID, cliente, teléfono o estado"
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

      <Card className="border-border overflow-hidden">
        <CardHeader className="border-b border-border bg-muted/30">
          <CardTitle className="text-base font-medium">Listado de pedidos</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="p-6 text-destructive">Error cargando pedidos.</div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="size-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground">No se encontraron pedidos</h3>
              <p className="text-sm text-muted-foreground mt-1">Ajusta los filtros o espera a recibir nuevos pedidos.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pedido</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => {
                    const cfg = statusConfig(order.status)
                    const StatusIcon = cfg.icon
                    return (
                      <TableRow key={order.id} className="cursor-pointer" onClick={() => navigate(`detail/${order.id}`)}>
                        <TableCell className="font-medium">#{order.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">{order.customer_name ?? 'N/D'}</p>
                            <p className="text-xs text-muted-foreground">{order.customer_phone ?? '—'}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={cfg.variant as any} className="gap-1 capitalize">
                            <StatusIcon className="size-3" />
                            {cfg.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{fmtDate(order.created_at)}</TableCell>
                        <TableCell className="font-semibold">${fmtMoney(order.total)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation()
                                navigate(`detail/${order.id}`)
                              }}
                              title="Ver detalle"
                            >
                              <Eye className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              asChild
                              onClick={(e) => e.stopPropagation()}
                              title="Descargar factura"
                            >
                              <a href={`/api/orders/${order.id}/invoice/`} target="_blank" rel="noreferrer">
                                <FileText className="size-4" />
                              </a>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card p-4">
        <div className="text-sm text-muted-foreground">{pagination.resultsText}</div>
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
