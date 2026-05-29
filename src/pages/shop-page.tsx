import { useMemo, useState } from 'react';
import { ProductCard } from '@/components/own/product-card'; // El que hicimos antes
import { LayoutGrid, List as ListIcon, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductListItem } from '@/components/own/product-list-item';
import { useProducts } from '@/hooks/api';
import { useParams } from 'react-router-dom';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

const filterGroups = [
  "PRODUCT STATUS", "PRICE", "BRAND", "COLOUR", "TV SIZE", "MEMORY"
];
export default function ShopPage() {
  const { categorySlug, search } = useParams<{ categorySlug: string, search: string, }>()
  const { data, isLoading, params: { page, setPage }, pagination: { prevPage, nextPage, totalPages } } = useProducts({ sort: "featured_newest", q: search, category: categorySlug });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const pageNumbers = useMemo(() => generatePageNumbers(page, totalPages), [page, totalPages]);
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 bg-background text-foreground transition-colors">

      {/* Categorías Superiores (Referencia image_794016.png) */}
      {/* <section className="space-y-4 hidden">
        <h2 className="text-xl font-bold tracking-tight">Categories</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.slice(0, 8).map((cat) => (
            <Button 
              key={cat.id} 
              variant="outline" 
              className="rounded-full flex gap-2 items-center px-6 h-12 border-border hover:border-primary hover:text-primary transition-all shrink-0"
            >
              <img src={cat.image} className="w-6 h-6 rounded-full object-cover" alt="" />
              <span className="font-bold text-xs uppercase tracking-tight">{cat.name}</span>
            </Button>
          ))}
        </div>
      </section> */}

      <div className="flex flex-col lg:flex-row gap-8">

        {/* Sidebar de Filtros (Referencia image_794016.png) */}
        <aside className="w-full lg:w-64 shrink-0 space-y-2 hidden">
          {filterGroups.map((filter) => (
            <div
              key={filter}
              className="flex justify-between items-center p-4 border border-border rounded-lg bg-card hover:bg-accent/50 cursor-pointer group transition-colors"
            >
              <span className="text-[11px] font-bold uppercase tracking-widest">{filter}</span>
              <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          ))}
        </aside>

        {/* Listado de Productos */}
        <main className="flex-1 space-y-6">
          {/* Toolbar */}
          <div className="flex justify-between items-center border-b border-border pb-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-medium text-muted-foreground">Sort By : Newest Arrivals</span>
              <div className="flex border border-border rounded-md overflow-hidden">
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className="rounded-none h-8 w-8"
                >
                  <LayoutGrid size={14} />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className="rounded-none h-8 w-8"
                >
                  <ListIcon size={14} />
                </Button>
              </div>
            </div>
            <ProductPagination
              page={page}
              setPage={setPage}
              totalPages={totalPages}
              pageNumbers={pageNumbers}
              nextPage={nextPage}
              prevPage={prevPage}
            />
          </div>

          {/* Grid de Productos */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-80 w-full rounded-2xl" />)}
            </div>
          ) : (
            <div className={
              viewMode === 'grid'
                ? "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
                : "flex flex-col gap-4"
            }>
              {data?.items.map((product) => (
                viewMode === 'grid' ? <ProductCard
                  key={product.id}
                  to={`/shop/${product.id}`}
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.main_image_url_path ?? ""
                  }}
                /> :
                  <ProductListItem
                    key={product.id}
                    product={{
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.main_image_url_path ?? "",
                      description: product.description ?? ""
                    }}
                  />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
type ProductPaginationProps = {
  page:number 
  setPage:(number:any) => void
  totalPages:number
  pageNumbers:(string | number)[]
  prevPage:() => void
  nextPage:() => void
}
const ProductPagination = ({ page, setPage, totalPages, pageNumbers, prevPage, nextPage}:ProductPaginationProps) => (

  <div>
    <Pagination>
      <PaginationContent className="flex items-center gap-1">

        <PaginationItem>
          <PaginationPrevious
            text="Anterior"
            onClick={prevPage}
            className={page === 1 ? "pointer-events-none opacity-40" : "cursor-pointer"}
          />
        </PaginationItem>

        {pageNumbers.map((p, index) => {
          if (p === '...') {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          const isCurrent = p === page;

          return (
            <PaginationItem key={p}>
              <PaginationLink
                onClick={() => setPage(Number(p))}
                isActive={isCurrent}
                className={
                  isCurrent
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground font-bold cursor-default border-primary"
                    : "cursor-pointer hover:bg-accent"
                }
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            text="Siguiente"
            onClick={nextPage}
            className={page === totalPages ? "pointer-events-none opacity-40" : "cursor-pointer"}
          />
        </PaginationItem>

      </PaginationContent>
    </Pagination>
  </div>
)
const generatePageNumbers = (current: number, total: number) => {
  const MAX_VISIBLE_PAGES = 9; // Puedes cambiarlo a 5 o 7 según prefieras

  // Si el total de páginas es menor o igual al máximo permitido, mostramos todas
  if (total <= MAX_VISIBLE_PAGES) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const siblings = 1; // Cantidad de números a los lados de la página activa

  const leftSiblingIndex = Math.max(current - siblings, 2);
  const rightSiblingIndex = Math.min(current + siblings, total - 1);

  const showLeftEllipsis = leftSiblingIndex > 2;
  const showRightEllipsis = rightSiblingIndex < total - 1;

  // Caso 1: Mostrar elipsis solo a la derecha (estamos cerca del inicio)
  if (!showLeftEllipsis && showRightEllipsis) {
    const leftItemCount = MAX_VISIBLE_PAGES - 2; // Restamos la primera y última página
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
    return [...leftRange, '...', total];
  }

  // Caso 2: Mostrar elipsis solo a la izquierda (estamos cerca del final)
  if (showLeftEllipsis && !showRightEllipsis) {
    const rightItemCount = MAX_VISIBLE_PAGES - 2;
    const rightRange = Array.from({ length: rightItemCount }, (_, i) => total - rightItemCount + i + 1);
    return [1, '...', ...rightRange];
  }

  // Caso 3: Mostrar elipsis en ambos lados (estamos en el medio)
  const middleRange = Array.from(
    { length: rightSiblingIndex - leftSiblingIndex + 1 },
    (_, i) => leftSiblingIndex + i
  );
  return [1, '...', ...middleRange, '...', total];
};