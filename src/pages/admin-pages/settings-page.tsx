import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SettingsForm, { type SettingsFormData } from "@/components/own/forms/settings-form"

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsFormData>({
    storeName: "GyApp Store",
    currency: "USD",
    taxRate: "21",
    supportEmail: "soporte@gyapp.com",
  })
  const [editing, setEditing] = useState(true)

  const handleSave = (updated: SettingsFormData) => {
    setSettings(updated)
    setEditing(false)
  }

  const handleEdit = (updated: SettingsFormData) => {
    setSettings(updated)
    setEditing(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Ajustes</h1>
          <p className="text-sm text-muted-foreground">Configura los datos generales de la tienda y los contactos.</p>
        </div>
        <Button onClick={() => setEditing(true)}>Editar ajustes</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información actual</CardTitle>
          <CardDescription>Estos ajustes aplican a la experiencia global de la tienda.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium">Nombre de tienda</p>
            <p className="text-foreground">{settings.storeName}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Moneda</p>
            <p className="text-foreground">{settings.currency}</p>
          </div>
          <div>
            <p className="text-sm font-medium">IVA</p>
            <p className="text-foreground">{settings.taxRate}%</p>
          </div>
          <div>
            <p className="text-sm font-medium">Email de soporte</p>
            <p className="text-foreground">{settings.supportEmail}</p>
          </div>
        </CardContent>
      </Card>

      {editing ? <SettingsForm data={settings} onSave={handleSave} onEdit={handleEdit} /> : null}
    </div>
  )
}
