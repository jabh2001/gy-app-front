import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

export default function SettingsAdminIndex() {
  const [query, setQuery] = useState("")
  const navigate = useNavigate()

  const filteredSettings = useMemo(
    () =>
      mockSettings.filter((settings) =>
        [settings.storeName, settings.currency, settings.supportEmail].some((value) =>
          value.toLowerCase().includes(query.toLowerCase())
        )
      ),
    [query]
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Ajustes</h1>
          <p className="text-sm text-muted-foreground">Configura los datos generales de la tienda.</p>
        </div>
        <Button onClick={() => navigate("create")}>Editar ajustes</Button>
      </div>

      <div className="grid gap-4 rounded-3xl border border-border/70 bg-muted p-4 md:grid-cols-[1fr_auto]">
        <label className="grid gap-2">
          <span className="text-sm font-medium">Buscar</span>
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar ajustes por nombre, email o moneda"
          />
        </label>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl border border-border/70 bg-background px-4 py-3 text-sm text-muted-foreground">
            Espacio para filtros
          </div>
          <div className="rounded-xl border border-border/70 bg-background px-4 py-3 text-sm text-muted-foreground">
            Ordenar y refinamiento
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredSettings.map((settings) => (
          <Card key={settings.id} className="space-y-4">
            <CardHeader>
              <CardTitle>{settings.storeName}</CardTitle>
              <CardDescription>Información general de la tienda.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <div className="text-sm text-muted-foreground">Moneda: {settings.currency}</div>
              <div className="text-sm text-muted-foreground">IVA: {settings.taxRate}%</div>
              <div className="text-sm text-muted-foreground">Email soporte: {settings.supportEmail}</div>
            </CardContent>
            <div className="flex flex-wrap items-center gap-2 px-4 pb-4">
              <Button variant="outline" size="sm" onClick={() => navigate(`edit/${settings.id}`)}>
                Editar
              </Button>
              <Button variant="secondary" size="sm" onClick={() => navigate(`detail/${settings.id}`)}>
                Ver detalle
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
