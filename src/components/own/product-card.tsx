import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="group border-border bg-card text-card-foreground hover:shadow-lg transition-all duration-300 flex flex-col h-full rounded-[var(--radius)]">
      <CardContent className="p-4 flex-1">
        <div className="aspect-square w-full mb-6 flex items-center justify-center overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div className="text-center space-y-2">
          {/* Usamos secondary para el color del título del producto */}
          <h4 className="text-secondary text-sm font-medium line-clamp-1 px-2 group-hover:underline cursor-pointer">
            {product.name}
          </h4>
          <p className="text-foreground text-lg font-black tracking-tight">
            € {product.price.toFixed(2)}
          </p>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        {/* Usamos primary para el botón de acción principal */}
        <Button 
          variant="default"
          className="w-full font-bold text-xs uppercase tracking-wider h-11 rounded-[calc(var(--radius)-4px)] shadow-sm flex items-center justify-center gap-2"
        >
          <ShoppingCart size={18} strokeWidth={2.5} />
          ADD TO CART
        </Button>
      </CardFooter>
    </Card>
  );
}