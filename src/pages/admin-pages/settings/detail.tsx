import { useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { SettingsFormData } from "@/components/own/forms/settings-form"

interface SettingsData extends SettingsFormData {
  id: number
}

const mockSettings: SettingsData[] = [
  {
    id: 1,
    storeName: "GyApp Store",
    currency: "USD",
    taxRate: "21",
    supportEmail: "soporte@gyapp.com",
  },
]

export default function SettingsAdminDetail() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const settings = useMemo(
    () => mockSettings.find((item) => item.id === Number(id)),
    [id]
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Detalle de ajustes</h1>
          <p className="text-sm text-muted-foreground">Revisa los datos generales que aplican a la tienda.</p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Regresar
        </Button>
      </div>

      {settings ? (
        <Card>
          <CardHeader>
            <CardTitle>{settings.storeName}</CardTitle>
            <CardDescription>Configuración de la tienda y datos de soporte.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium">Moneda</p>
              <p className="text-foreground">{settings.currency}</p>
            </div>
            <div>
              <p className="text-sm font-medium">IVA</p>
              <p className="text-foreground">{settings.taxRate}%</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm font-medium">Email de soporte</p>
              <p className="text-foreground">{settings.supportEmail}</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">No se encontró la configuración solicitada.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
