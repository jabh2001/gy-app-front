
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
import type { ImportOptions } from "@/api/products"

type Props = {
    children: React.ReactNode
}
export default function ImportInventory({ children }: Props) {
  return (
          <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Importar inventario</DialogTitle>
                <DialogDescription>
                  Importa el inventario de productos desde un archivo Excel.
                </DialogDescription>
              </DialogHeader>

              <InventoryUpload
                importInventoryFile={async (file: File, options: ImportOptions) => {
                  const result = await importInventoryFile(file, options)
                  return result
                }}
              />
            </DialogContent>
          </Dialog>
  )
}
