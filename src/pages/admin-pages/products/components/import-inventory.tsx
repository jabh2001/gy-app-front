
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { InventoryUpload } from "@/components/own/forms/inventory-import-form"
import { importInventoryFile } from "@/api/products"

type Props = {
    children: React.ReactNode
}
export default function ImportInventory({ children }: Props) {
  return (
          <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Importar inventario</DialogTitle>
                <DialogDescription>
                  Importa el inventario de productos desde un archivo Excel.
                </DialogDescription>
              </DialogHeader>

              <InventoryUpload
                importInventoryFile={async (file) => {
                  await importInventoryFile(file)
                  return {
                    success: true,
                    message: "Inventario importado exitosamente",
                    created: 10,
                    updated: 5,
                  }
                }}
              />
            </DialogContent>
          </Dialog>
  )
}