import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useCart } from '@/hooks/api/useCart';
import { MultiHostImage } from "@/components/own/multi-host-image"
import { showApiError } from "@/api";

type Props = {
  product: Product
  onClickAddToCart?: (product:Product) => void
  to?:string
}
interface Product {
  id: number;
  name: string;
  price: number;
  sale_price?: number | null;
  image?: string;
}

export function ProductCard({ product, onClickAddToCart, to }: Props) {
  const { addToCart, isLoading } = useCart();

  const handleButtonClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (onClickAddToCart) {
      onClickAddToCart(product);
      return;
    }
    try {
      await addToCart(product.id, 1);
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      toast.error('No fue posible agregar el producto al carrito');
      showApiError(error, 'No fue posible agregar el producto al carrito');
      return;
    }
    toast.success(`${product.name} agregado al carrito`);
  };

  return (
    <Link to={to ?? ""}>
      <Card className="group border-border bg-card text-card-foreground hover:shadow-lg transition-all duration-300 flex flex-col h-full rounded-[var(--radius)]">
        <CardContent className="p-4 flex-1">
          <div className="aspect-square w-full mb-6 flex items-center justify-center overflow-hidden">
            <MultiHostImage
              path={product.image}
              alt={product.name}
              className="size-full object-contain group-hover:scale-105 transition-transform duration-500"
              />

          </div>

          <div className="text-center space-y-2">
            {/* Usamos secondary para el color del título del producto */}
            <h4 className="text-secondary text-sm font-medium line-clamp-1 px-2 group-hover:underline cursor-pointer">
              {product.name.toUpperCase()}
            </h4>
            <p className="text-foreground text-lg font-black tracking-tight flex gap-1 justify-center items-start">
              
              {
                product.sale_price && product.sale_price < product.price ? (
                  <>
                    <span>
                      ${product.sale_price.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-xs text-red-400 line-through">
                      ${product.price.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </span>
                  </>
                ) : (
                  <span>
                    ${product.price.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                  </span>
                )}
            </p>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          {/* Usamos primary para el botón de acción principal */}
          <Button 
            onClick={handleButtonClick}
            variant="default"
            className="w-full font-bold text-xs uppercase tracking-wider h-11 rounded-[calc(var(--radius)-4px)] shadow-sm flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            <ShoppingCart size={18} strokeWidth={2.5} />
            {isLoading ? 'Añadiendo...' : (
              <span>
                <span className="hidden md:inline">AÑADIR AL CARRITO</span>
                <span className="md:hidden">AÑADIR</span>
              </span>
            )}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}