import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '@/hooks/api/useCart'
import { useBillingData, useCheckout } from '@/hooks/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function CartPage() {
  const navigate = useNavigate()
  const { cart, isLoading: cartLoading, error: cartError } = useCart()
  const billingQuery = useBillingData()
  const checkout = useCheckout()

  const billingData = useMemo(() => billingQuery.data ?? [], [billingQuery.data])
  const [selectedBillingId, setSelectedBillingId] = useState<number | null>(null)
  const [paymentMethod, setPaymentMethod] = useState('credit_card')
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const total = useMemo(() => cart?.items.reduce((acc, item) => acc + item.price * item.quantity, 0) ?? 0, [cart])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatusMessage(null)
    setErrorMessage(null)

    if (!selectedBillingId) {
      setErrorMessage('Selecciona un perfil de facturación para continuar.')
      return
    }

    if (!cart || !cart.items.length) {
      setErrorMessage('El carrito está vacío.')
      return
    }

    try {
      const result = await checkout.mutateAsync({
        session_id: cart.session_id ?? undefined,
        billing_data_id: selectedBillingId,
        payment_method: paymentMethod,
      })
      setStatusMessage('Compra realizada correctamente. Redirigiendo a WhatsApp...')
      setErrorMessage(null)

      if (result?.whatsapp_url) {
        window.location.href = result.whatsapp_url
        return
      }

      if (result?.order?.id) {
        navigate(`/orders/${result.order.id}`)
        return
      }

      navigate('/profile')
    } catch (errorData) {
      setErrorMessage('No fue posible finalizar la compra. Intenta de nuevo.')
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto grid max-w-7xl gap-8 xl:grid-cols-[1.4fr_0.9fr]">
        <section className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="mb-4">
              <h1 className="text-3xl font-semibold">Checkout</h1>
              <p className="text-sm text-slate-500">Revisa tu carrito y completa tu pedido en un solo paso.</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Resumen del carrito</CardTitle>
                <CardDescription>Verifica productos, cantidades y totales antes de pagar.</CardDescription>
              </CardHeader>
              <CardContent>
                {cartLoading ? (
                  <p className="text-sm text-slate-500">Cargando carrito...</p>
                ) : cartError ? (
                  <p className="text-sm text-red-600">Error cargando el carrito.</p>
                ) : !cart?.items.length ? (
                  <div className="space-y-3">
                    <p className="text-sm text-slate-600">Tu carrito está vacío.</p>
                    <Button onClick={() => navigate('/shop')}>Ir a la tienda</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      {cart.items.map((item) => (
                        <div key={item.product_id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="font-semibold">{item.product?.name}</p>
                              <p className="text-sm text-slate-600">Cantidad: {item.quantity}</p>
                            </div>
                            <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="flex flex-col gap-2 text-right">
                      <p className="text-sm text-slate-600">Total:</p>
                      <p className="text-2xl font-semibold">${total.toFixed(2)}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Facturación y pago</CardTitle>
              <CardDescription>Selecciona tu perfil de facturación y confirma el método de pago.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-3">
                  <p className="text-sm font-medium">Perfil de facturación</p>
                  {billingQuery.isLoading ? (
                    <p className="text-sm text-slate-500">Cargando tus datos...</p>
                  ) : billingData.length ? (
                    <div className="space-y-2">
                      {billingData.map((billing) => (
                        <label key={billing.id} className="flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-colors hover:border-slate-400">
                          <input
                            type="radio"
                            name="billing"
                            value={billing.id}
                            checked={selectedBillingId === billing.id}
                            onChange={() => setSelectedBillingId(billing.id)}
                            className="h-4 w-4 text-primary"
                          />
                          <div>
                            <p className="font-semibold">{billing.full_name}</p>
                            <p className="text-sm text-slate-600">RIF: {billing.rif}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-slate-600">No tienes perfiles de facturación guardados.</p>
                      <Link to="/profile" className="text-sm font-medium text-primary underline">Agregar uno en tu perfil</Link>
                    </div>
                  )}
                </div>

                <div className="hidden gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-medium">
                    Método de pago
                    <select
                      value={paymentMethod}
                      onChange={(event) => setPaymentMethod(event.target.value)}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                    >
                      <option value="credit_card">Tarjeta de crédito</option>
                      <option value="paypal">PayPal</option>
                      <option value="cash">Efectivo</option>
                    </select>
                  </label>

                  <label className="grid gap-2 text-sm font-medium">
                    Comentarios de pedido
                    <Input placeholder="Notas para el vendedor (opcional)" disabled />
                  </label>
                </div>

                {statusMessage && <p className="text-sm text-emerald-600">{statusMessage}</p>}
                {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

                <Button type="submit" disabled={checkout.isLoading || cartLoading || !cart?.items.length}>
                  {checkout.isLoading ? 'Procesando...' : 'Finalizar compra'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        <aside className="space-y-6 rounded-3xl bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-xl font-semibold">Ayuda rápida</h2>
            <p className="mt-2 text-sm text-slate-500">Asegúrate de tener un perfil de facturación guardado antes de confirmar.</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium">Estado del carrito</p>
            <p className="mt-2 text-sm text-slate-700">{cart?.items.length ?? 0} artículos</p>
            <p className="mt-1 text-sm text-slate-700">Total estimado: ${total.toFixed(2)}</p>
          </div>
        </aside>
      </div>
    </main>
  )
}
