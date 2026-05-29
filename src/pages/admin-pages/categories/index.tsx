import { useNavigate } from "react-router-dom"
import { Grip, Search, } from "lucide-react"

import useTitle from "@/hooks/use-title"
import { useQ } from "@/hooks/api/use-query-params"
import { useCategories } from "@/hooks/api"
import { useDebounce } from "@/hooks/use-debounce"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

import SortSelect from "./components/sort-select"
import FilterSelect from "./components/filter-select"
import CategoriesTable from "./components/categories-table"

export default function CategoriesAdminIndex() {
  useTitle("Categorías - Panel de administración")
  const [query, setQuery] = useQ()
  const debouncedQuery = useDebounce(query, 500)
  const navigate = useNavigate()
  const { data, pagination:{ firstPage, prevPage, nextPage, page, totalPages, showedItems, total } } = useCategories({ q: debouncedQuery })

  const categories = data?.items ?? []

  return (
    <div className="space-y-6">
      <section className="grid gap-3 border border-border/70 bg-gray-200 p-3 shadow-sm lg:grid-cols-[auto_1fr_auto] md:items-center">
        <div className="order-1 w-full flex flex-wrap gap-2 justify-end">
          <Button className="h-11 rounded-2xl" onClick={() => navigate("/admin/categories/create")}>
            <Grip />
            Crear categoría
          </Button>
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
      <CategoriesTable
        categories={categories}
      />
    </div>
  )
}
