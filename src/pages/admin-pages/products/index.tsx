import { useEffect } from "react"
import { Grip, Search, Upload, } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useProducts } from "@/hooks/api"
import ImportInventory from "./components/import-inventory"
import ProductCard from "./components/ProductCard"
import SortSelect from "./components/sort-select"
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { useNavigate } from "react-router-dom"
import useTitle from "@/hooks/use-title"
import FilterSelect from "./components/filter-select"
import { useQ } from "@/hooks/api/use-query-params"
import { useDebounce } from "@/hooks/use-debounce"

export default function ProductsAdminIndex() {
  useTitle("Productos - Panel de administración")
  const navigate = useNavigate()
  const [query, setQuery] = useQ()
  const debouncedQuery = useDebounce(query, 500)
  const { data, pagination:{ firstPage, prevPage, nextPage, page, totalPages, showedItems, total } } = useProducts({ q: debouncedQuery })


  const products = data?.items ?? []

  useEffect(() => {
    console.log("Productos cargados:", products)
  }, [products])

  return (
    <div className="mx-auto flex w-full flex-col gap-6">
      <section className="grid gap-3 border border-border/70 bg-gray-200 p-3 shadow-sm lg:grid-cols-[auto_1fr_auto] md:items-center">
        <div className="order-1 w-full flex flex-wrap gap-2 justify-end">
          <Button className="h-11 rounded-2xl" onClick={() => navigate("/admin/products/create")}>
            <Grip />
            Crear producto
          </Button>
          <ImportInventory>
            <Button className="h-11 rounded-2xl bg-emerald-500">
              <Upload className="mr-2 h-4 w-4" />
              Importar inventario
            </Button>
          </ImportInventory>
        </div>
        <label className="order-0 lg:order-2 w-full relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => {setQuery(event.target.value);firstPage()}}
            placeholder="Buscar producto, SKU, etiqueta o descripción"
            className="h-11 rounded-2xl bg-background pl-9"
          />
        </label>

        <div className="order-3 w-full flex flex-wrap gap-2 justify-end">
          <FilterSelect />
          <SortSelect />
        </div>
        <div className="order-4 w-full col-start-1 lg:col-end-4 flex justify-end w-full">
          <span>

            <Pagination>
              <PaginationContent>
                <span>  
                  {`Página ${page} de ${totalPages}`}
                </span>
                <PaginationItem>
                  <PaginationPrevious  text="Anterior" onClick={prevPage} />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext text="Siguiente" onClick={nextPage} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </span>
        </div>
        <div className="order-5 w-full col-start-1 lg:col-end-4 flex justify-end w-full">
          <span>
            <p className="text-sm text-muted-foreground">
              Mostrando <span className="font-bold text-foreground">{showedItems}</span> de{" "}
              <span className="font-bold text-foreground">{total}</span> productos
            </p>
          </span>
        </div>
      </section>

      {products.length > 0 ? (
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 px-2">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </section>
      ) : <NotProductCard />
      }
    </div>
  )
}

const NotProductCard = () => (
  <Card className="rounded-3xl border-dashed p-10 text-center">
    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
      <Search className="h-6 w-6" />
    </div>
    <h2 className="text-lg font-semibold">No se encontraron productos</h2>
    <p className="mt-1 text-sm text-muted-foreground">
      Prueba con otro nombre, SKU, etiqueta o descripción.
    </p>
  </Card>
)