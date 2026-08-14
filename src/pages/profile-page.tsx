import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { showApiError } from '@/api/index'
import useTitle from '@/hooks/use-title'
import { useSession } from '@/hooks/use-session'
import { useBillingData, useCreateBillingData, useUpdateBillingData, useDeleteBillingData } from '@/hooks/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const initialBillingForm = {
  full_name: '',
  address_line1: '',
  rif: '',
  phone: '',
}

export default function ProfilePage() {
  useTitle('Mi perfil')
  const user = useSession(store => store.user)
  const navigate = useNavigate()

  const checkSession = useSession((state) => state.checkSession)
  const updateProfile = useSession((state) => state.updateProfile)

  const billingQuery = useBillingData()
  const createBilling = useCreateBillingData()
  const updateBilling = useUpdateBillingData()
  const deleteBilling = useDeleteBillingData()

  const [profileForm, setProfileForm] = useState({ username: '', email: '', password: '' })
  const [billingForm, setBillingForm] = useState(initialBillingForm)
  const [selectedBillingId, setSelectedBillingId] = useState<number | null>(null)

  useEffect(() => {
    if (!user) {
      checkSession().catch(() => {
        navigate('/login', { replace: true })
      })
      return
    }

    setProfileForm({
      username: user.username,
      email: user.email,
      password: '',
    })
  }, [user, checkSession, navigate])

  const billingData = useMemo(() => billingQuery.data ?? [], [billingQuery.data])
  const selectedBilling = useMemo(
    () => billingData.find((item) => item.id === selectedBillingId) ?? null,
    [billingData, selectedBillingId],
  )

  useEffect(() => {
    if (selectedBilling) {
      setBillingForm({
        full_name: selectedBilling.full_name,
        address_line1: selectedBilling.address_line1 ?? '',
        rif: selectedBilling.rif,
        phone: selectedBilling.phone ?? '',
      })
    }
  }, [selectedBilling])

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      const payload: Partial<{ username: string; email: string; password: string }> = {
        username: profileForm.username,
        email: profileForm.email,
      }

      if (profileForm.password) {
        payload.password = profileForm.password
      }

      await updateProfile(payload)
      setProfileForm((prev) => ({ ...prev, password: '' }))
      toast.success('Perfil actualizado correctamente.')
    } catch (errorData) {
      showApiError(errorData, 'No se pudo actualizar el perfil')
    }
  }

  const handleBillingSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const payload = {
      full_name: billingForm.full_name,
      address_line1: billingForm.address_line1 || undefined,
      rif: billingForm.rif,
      phone: billingForm.phone || undefined,
    }

    try {
      if (selectedBillingId) {
        await updateBilling.mutateAsync({ billingId: selectedBillingId, payload })
        toast.success('Datos de facturación actualizados.')
      } else {
        await createBilling.mutateAsync(payload)
        toast.success('Perfil de facturación creado.')
      }
      setSelectedBillingId(null)
      setBillingForm(initialBillingForm)
    } catch (errorData) {
      showApiError(errorData, 'No se pudo guardar el perfil de facturación')
    }
  }

  const handleBillingDelete = async (billingId: number) => {
    try {
      await deleteBilling.mutateAsync(billingId)
      if (selectedBillingId === billingId) {
        setSelectedBillingId(null)
        setBillingForm(initialBillingForm)
      }
      toast.success('Perfil de facturación eliminado.')
    } catch (errorData) {
      showApiError(errorData, 'No se pudo eliminar el perfil de facturación')
    }
  }

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <section className="w-full max-w-lg rounded-3xl bg-white p-6 shadow">
          <p className="text-center text-base text-slate-700">Cargando datos de sesión...</p>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold">Mi perfil</h1>
          <p className="text-sm text-slate-500">Administra tu información, facturación y revisa tus pedidos.</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="w-full md:w-auto flex-wrap h-auto gap-1 bg-white p-1 rounded-xl shadow-sm border border-slate-200 justify-start">
            <TabsTrigger value="profile" className="gap-1.5 rounded-lg text-sm px-4">
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              Datos Personales
            </TabsTrigger>
            <TabsTrigger value="billing" className="gap-1.5 rounded-lg text-sm px-4">
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
              Facturación
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-1.5 rounded-lg text-sm px-4">
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
              </svg>
              Mis Pedidos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <div className="grid max-w-3xl gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información de usuario</CardTitle>
                  <CardDescription>Nombre, correo y contraseña.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4" onSubmit={handleProfileSubmit}>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="grid gap-2 text-sm font-medium">
                        Usuario
                        <Input
                          value={profileForm.username}
                          onChange={(event) => setProfileForm((prev) => ({ ...prev, username: event.target.value }))}
                        />
                      </label>
                      <label className="grid gap-2 text-sm font-medium">
                        Correo electrónico
                        <Input
                          type="email"
                          value={profileForm.email}
                          onChange={(event) => setProfileForm((prev) => ({ ...prev, email: event.target.value }))}
                        />
                      </label>
                    </div>

                    <label className="grid gap-2 text-sm font-medium">
                      Nueva contraseña
                      <Input
                        type="password"
                        value={profileForm.password}
                        onChange={(event) => setProfileForm((prev) => ({ ...prev, password: event.target.value }))}
                        placeholder="Dejar en blanco para mantener la contraseña actual"
                      />
                    </label>

                    <div className="flex flex-wrap gap-3">
                      <Button type="submit">Guardar cambios</Button>
                      <Button variant="outline" type="button" onClick={() => navigate('/')}>Volver a inicio</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="billing" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
              <Card>
                <CardHeader>
                  <CardTitle>{selectedBillingId ? 'Editar perfil de facturación' : 'Crear perfil de facturación'}</CardTitle>
                  <CardDescription>Añade dirección, empresa y datos fiscales para el checkout.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4" onSubmit={handleBillingSubmit}>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="grid gap-2 text-sm font-medium">
                        Nombre completo
                        <Input
                          value={billingForm.full_name}
                          onChange={(event) => setBillingForm((prev) => ({ ...prev, full_name: event.target.value }))}
                        />
                      </label>
                      <label className="grid gap-2 text-sm font-medium">
                        Teléfono
                        <Input
                          value={billingForm.phone}
                          onChange={(event) => setBillingForm((prev) => ({ ...prev, phone: event.target.value }))}
                        />
                      </label>
                    </div>
                    <label className="grid gap-2 text-sm font-medium">
                      Dirección
                      <Input
                        value={billingForm.address_line1}
                        onChange={(event) => setBillingForm((prev) => ({ ...prev, address_line1: event.target.value }))}
                      />
                    </label>

                    <label className="grid gap-2 text-sm font-medium">
                      RIF / Cedula
                      <Input
                        value={billingForm.rif}
                        onChange={(event) => setBillingForm((prev) => ({ ...prev, rif: event.target.value }))}
                      />
                    </label>

                    <div className="flex flex-wrap gap-3">
                      <Button type="submit" disabled={createBilling.isLoading || updateBilling.isLoading}>
                        {selectedBillingId ? 'Guardar cambios' : 'Agregar perfil'}
                      </Button>
                      {selectedBillingId && (
                        <Button type="button" variant="outline" onClick={() => {
                          setSelectedBillingId(null)
                          setBillingForm(initialBillingForm)
                        }}>
                          Cancelar edición
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Perfiles guardados</CardTitle>
                  <CardDescription>Selecciona un perfil para usarlo en el checkout o editarlo.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {billingQuery.isLoading ? (
                    <p className="text-sm text-slate-500">Cargando perfiles...</p>
                  ) : billingData.length ? (
                    billingData.map((item) => (
                      <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-sm font-semibold">{item.full_name}</p>
                            <p className="text-sm text-slate-600">RIF: {item.rif}</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button size="sm" variant="outline" onClick={() => setSelectedBillingId(item.id)}>
                              Editar
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleBillingDelete(item.id)}>
                              Eliminar
                            </Button>
                          </div>
                        </div>
                        <div className="mt-3 text-sm text-slate-700 space-y-1">
                          <p>{item.address_line1}</p>
                          {item.phone && <p>Tel: {item.phone}</p>}
                          <p>RIF: {item.rif}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No tienes perfiles de facturación guardados.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Pedidos</CardTitle>
                <CardDescription>Revisa todos los pedidos que has realizado en la tienda.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-sm text-slate-600 mb-4">Accede a la vista completa de tus pedidos.</p>
                  <Button onClick={() => navigate('/orders')}>
                    Ver todos mis pedidos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}