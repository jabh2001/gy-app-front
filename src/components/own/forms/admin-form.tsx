import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type ReactNode } from "react"

interface AdminFormProps {
  title: string
  description?: string
  submitLabel?: string
  submitLabelOnEdit?: string
  isEditing?: boolean
  onSubmit: () => void
  children: ReactNode
}

export default function AdminForm({
  title,
  description,
  submitLabel = "Guardar",
  submitLabelOnEdit,
  isEditing,
  onSubmit,
  children,
}: AdminFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <div className="text-sm text-muted-foreground">{description}</div> : null}
      </CardHeader>
      <CardContent className="grid gap-4">{children}</CardContent>
      <CardFooter className="justify-end">
        <Button onClick={onSubmit} className="rounded-[8px]">
          {isEditing ? submitLabelOnEdit ?? `Actualizar ${submitLabel}` : submitLabel}
        </Button>
      </CardFooter>
    </Card>
  )
}
