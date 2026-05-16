import { useEffect, useState } from 'react';
import { useProductStore } from '@/hooks/use-product-store';
import { ProductCard } from '@/components/own/product-card'; // El que hicimos antes
import { LayoutGrid, List as ListIcon, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductListItem } from '@/components/own/product-list-item';

export default function ShopPage() {
  const { products, categories, loading, fetchProducts, fetchCategories } = useProductStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const filterGroups = [
    "PRODUCT STATUS", "PRICE", "BRAND", "COLOUR", "TV SIZE", "MEMORY"
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 bg-background text-foreground transition-colors">
      
      {/* Categorías Superiores (Referencia image_794016.png) */}
      <section className="space-y-4">
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
      </section>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar de Filtros (Referencia image_794016.png) */}
        <aside className="w-full lg:w-64 shrink-0 space-y-2">
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
            <p className="text-sm text-muted-foreground">
              All Products - <span className="font-bold text-foreground">{products.length} items</span>
            </p>
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
          </div>

          {/* Grid de Productos */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-80 w-full rounded-2xl" />)}
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
              ? "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6" 
              : "flex flex-col gap-4"
            }>
              {products.map((product) => (
                viewMode === 'grid' ? <ProductCard 
                  key={product.id} 
                  product={{
                    id: product.id,
                    name: product.title,
                    price: product.price,
                    image: product.images[0]
                  }} 
                /> :
                <ProductListItem
                  key={product.id} 
                  product={{
                    id: product.id,
                    name: product.title,
                    price: product.price,
                    image: product.images[0],
                    description:product.description
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