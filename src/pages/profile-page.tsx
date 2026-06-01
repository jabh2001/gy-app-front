import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import useTitle from '@/hooks/use-title'
import { useSession } from '@/hooks/use-session'
import { normalizeApiError } from '@/api/index'
import { useBillingData, useCreateBillingData, useUpdateBillingData, useDeleteBillingData } from '@/hooks/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const initialBillingForm = {
  full_name: '',
  address_line1: '',
  rif: '',
  phone: '',
}

export default function ProfilePage() {
  useTitle('Mi perfil')
  const user= useSession(store => store.user)
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
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

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
    setErrorMessage(null)
    setStatusMessage(null)

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
      setStatusMessage('Perfil actualizado correctamente.')
    } catch (errorData) {
      const apiError = normalizeApiError(errorData)
      setErrorMessage(apiError.message || 'No se pudo actualizar el perfil.')
    }
  }

  const handleBillingSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(null)
    setStatusMessage(null)

    const payload = {
      full_name: billingForm.full_name,
      address_line1: billingForm.address_line1 || undefined,
      rif: billingForm.rif,
      phone: billingForm.phone || undefined,
    }

    try {
      if (selectedBillingId) {
        await updateBilling.mutateAsync({ billingId: selectedBillingId, payload })
        setStatusMessage('Datos de facturación actualizados.')
      } else {
        await createBilling.mutateAsync(payload)
        setStatusMessage('Perfil de facturación creado.')
      }
      setSelectedBillingId(null)
      setBillingForm(initialBillingForm)
    } catch (errorData) {
      const apiError = normalizeApiError(errorData)
      setErrorMessage(apiError.message || 'No se pudo guardar el perfil de facturación.')
    }
  }

  const handleBillingDelete = async (billingId: number) => {
    setErrorMessage(null)
    setStatusMessage(null)
    try {
      await deleteBilling.mutateAsync(billingId)
      if (selectedBillingId === billingId) {
        setSelectedBillingId(null)
        setBillingForm(initialBillingForm)
      }
      setStatusMessage('Perfil de facturación eliminado.')
    } catch (errorData) {
      const apiError = normalizeApiError(errorData)
      setErrorMessage(apiError.message || 'No se pudo eliminar el perfil de facturación.')
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
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.5fr_1fr]">
        <section className="space-y-4 rounded-3xl bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h1 className="text-2xl font-semibold">Mi perfil</h1>
            <p className="text-sm text-slate-500">Actualiza tus datos básicos y tu información de facturación.</p>
          </div>

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

                {statusMessage && <p className="text-sm text-emerald-600">{statusMessage}</p>}
                {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

                <div className="flex flex-wrap gap-3">
                  <Button type="submit">Guardar cambios</Button>
                  <Button variant="outline" type="button" onClick={() => navigate('/')}>Volver a inicio</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4 rounded-3xl bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-xl font-semibold">Mis datos de facturación</h2>
            <p className="text-sm text-slate-500">Gestiona varios perfiles para usar en el checkout.</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{selectedBillingId ? 'Editar perfil de facturación' : 'Crear perfil de facturación'}</CardTitle>
              <CardDescription>Añade dirección, empresa y datos fiscales.</CardDescription>
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
                  RIF
                  <Input
                    value={billingForm.rif}
                    onChange={(event) => setBillingForm((prev) => ({ ...prev, rif: event.target.value }))}
                  />
                </label>

                {statusMessage && <p className="text-sm text-emerald-600">{statusMessage}</p>}
                {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

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
              <CardDescription>Selecciona un perfil para usarlo en el checkout.</CardDescription>
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
        </section>
      </div>
    </main>
  )
}