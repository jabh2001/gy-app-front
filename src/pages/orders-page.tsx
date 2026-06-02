import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useTitle from '@/hooks/use-title'
import { useOrders } from '@/hooks/api/useOrders'
import { useSession } from '@/hooks/use-session'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ShoppingBag, Package, ChevronRight } from 'lucide-react'

function statusColor(status?: string) {
  const s = (status || '').toLowerCase()
  if (s === 'pending') return 'bg-amber-100 text-amber-800 border-amber-200'
  if (s === 'invoiced') return 'bg-sky-100 text-sky-800 border-sky-200'
  if (s === 'completed') return 'bg-emerald-100 text-emerald-800 border-emerald-200'
  if (s === 'cancelled' || s === 'cancelado') return 'bg-red-100 text-red-800 border-red-200'
  return 'bg-gray-100 text-gray-800 border-gray-200'
}

function statusLabel(status?: string) {
  const s = (status || '').toLowerCase()
  if (s === 'pending') return 'Pendiente'
  if (s === 'invoiced') return 'Facturado'
  if (s === 'completed') return 'Completado'
  if (s === 'cancelled' || s === 'cancelado') return 'Cancelado'
  return status || 'Desconocido'
}

export default function OrdersPage() {
  useTitle('Mis pedidos')
  const navigate = useNavigate()
  const user = useSession((s) => s.user)
  const { data, isLoading, pagination } = useOrders()

  if (!user) {
    navigate('/login', { replace: true })
    return null
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Mis pedidos</h1>
          <p className="text-sm text-slate-500">Revisa el estado y los detalles de todas tus compras.</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-2xl" />
            ))}
          </div>
        ) : data?.items?.length ? (
          <div className="space-y-4">
            {data.items.map((order) => (
              <Link key={order.id} to={`/orders/${order.id}`} className="block">
                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all hover:border-primary/30 group cursor-pointer">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="flex items-center gap-2">
                            <Package className="size-5 text-primary" />
                            <h3 className="font-bold text-slate-900 text-lg">
                              Pedido #{order.id}
                            </h3>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColor(order.status)} capitalize`}>
                            {statusLabel(order.status)}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-slate-500">Fecha</p>
                            <p className="font-medium text-slate-800">
                              {order.created_at ? new Date(order.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-500">Total</p>
                            <p className="font-bold text-slate-900 text-base">
                              ${order.total?.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-500">Artículos</p>
                            <p className="font-medium text-slate-800">
                              {order.items?.length || 0} productos
                            </p>
                          </div>
                        </div>

                        {order.items && order.items.length > 0 && (
                          <div className="flex -space-x-2">
                            {order.items.slice(0, 4).map((item) => (
                              <div key={item.id} className="size-8 rounded-full border-2 border-white bg-slate-100 overflow-hidden">
                                {item.product?.main_image_url_path ? (
                                  <img src={item.product.main_image_url_path} alt="" className="size-full object-cover" />
                                ) : (
                                  <div className="size-full flex items-center justify-center text-xs text-slate-400 font-bold">
                                    {item.product?.name?.charAt(0) || '?'}
                                  </div>
                                )}
                              </div>
                            ))}
                            {order.items.length > 4 && (
                              <div className="size-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                                +{order.items.length - 4}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <ChevronRight className="size-5 text-slate-300 group-hover:text-primary transition-colors shrink-0 mt-2" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}

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
                <span className="text-sm text-slate-500">
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
          <Card className="rounded-2xl border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <ShoppingBag className="size-12 text-slate-300 mb-4" />
              <h2 className="text-lg font-semibold text-slate-700">No tienes pedidos</h2>
              <p className="text-sm text-slate-500 mt-1">Tus compras aparecerán aquí.</p>
              <Button className="mt-4" onClick={() => navigate('/shop')}>
                Ir a la tienda
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
