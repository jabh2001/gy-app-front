import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  ChevronRight, 
  Minus, 
  Plus, 
  Heart, 
  Share2, 
  FileText, 
  Info, 
  Truck, 
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';
import { useProductDetail } from '@/hooks/api';
import { useCart } from '@/hooks/api/useCart'; 
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, error } = useProductDetail(id); //
  const { addToCart } = useCart();

  const images = product?.images?.length
    ? [...product.images].sort((a, b) => a.order - b.order)
    : [];

  const mainImageIndex = images.findIndex(img => img.is_main);

  // Estados Locales para la UI
  const [activeImageIndex, setActiveImageIndex] = useState(
    mainImageIndex >= 0 ? mainImageIndex : 0
  );
  const [quantity, setQuantity] = useState(1);

  if (isLoading) return <ProductDetailSkeleton />;
  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold">Producto no encontrado {id}</h2>
        <Link to="/shop" className="text-primary hover:underline">Volver a la tienda</Link>
      </div>
    );
  }

  const handleQuantityChange = (type: 'inc' | 'dec') => {
    if (type === 'inc') {
      // Opcional: Validar contra product.stock si existe en tu modelo extendido
      setQuantity(prev => prev + 1);
    } else {
      setQuantity(prev => (prev > 1 ? prev - 1 : 1));
    }
  };

  // Cálculo de descuento simulado si existe precio de oferta en tu base de datos
  const hasDiscount = product.sale_price && product.sale_price < product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.price - product.sale_price!) / product.price) * 100)
    : 27; // Fallback estático de tu imagen

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 bg-background text-foreground">
      
      {/* 1. MIGA DE PAN / BREADCRUMBS (Referencia Superior) */}
      <nav className="flex items-center justify-between text-xs text-muted-foreground border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="hover:text-primary transition-colors">Principal</Link>
          <ChevronRight size={12} />
          <Link to="/shop" className="hover:text-primary transition-colors">Tienda</Link>
          <ChevronRight size={12} />
          <span className="text-foreground font-medium line-clamp-1">{product.name}</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-1 hover:text-foreground transition-colors"><ChevronLeft size={16} /></button>
          <button className="p-1 hover:text-foreground transition-colors"><ChevronRight size={16} /></button>
        </div>
      </nav>

      {/* CORDÓN PRINCIPAL DE CONTENIDO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* 2. COLUMNA IZQUIERDA: GALERÍA DE IMÁGENES (Estilo Amazon / MercadoLibre) */}
        <div className="lg:col-span-7 flex flex-col md:flex-row gap-4 relative">
          
          {/* Miniaturas Verticales */}
          <div className="flex md:flex-col gap-2 order-2 md:order-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 shrink-0">
            {images.map((img, idx: number) => (
              <button
                key={`img_tum_${img.id || idx}`}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 bg-card ${
                  activeImageIndex === idx ? 'border-yellow-400 shadow-sm' : 'border-border hover:border-muted-foreground'
                }`}
              >
                <img src={img.url_path} alt={`Miniatura ${idx + 1}`} className="w-full h-full object-contain p-1" />
                {img.is_main && (
                  <span className="absolute -top-1 -right-1 bg-amber-400 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-bold shadow">
                    ★
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Visor de Imagen Principal */}
          <div className="flex-1 order-1 md:order-2 bg-white border border-border rounded-2xl overflow-hidden p-6 relative flex items-center justify-center min-h-[400px] md:min-h-[500px]">
            <img 
              src={images[activeImageIndex]?.url_path ?? ""}
              alt={product.name} 
              className="max-h-[450px] object-contain transition-all duration-300"
            />
            
            {images[activeImageIndex]?.is_main && (
              <div className="absolute top-4 left-4 bg-amber-400 text-black text-xs font-bold px-2 py-1 rounded-full shadow">
                ★ Principal
              </div>
            )}

            <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-black uppercase px-3 py-3 rounded-full tracking-wider shadow-lg transform rotate-12 flex items-center justify-center aspect-square h-14 w-14 border-2 border-dashed border-white animate-pulse">
              Oferta
            </div>
          </div>
        </div>

        {/* 3. COLUMNA DERECHA: SECCIÓN DE COMPRA E INFORMACIÓN */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Título */}
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-card-foreground uppercase">
            {product.name}
          </h1>

          {/* Bloque de Precios */}
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-3xl font-extrabold text-foreground">
              ${(product.price * quantity).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Fila de Acción Directa: Selector de cantidad + Botón Añadir */}
          <div className="flex gap-3 items-center">
            
            {/* Selector de Cantidad */}
            <div className="flex items-center border border-border rounded-lg bg-card h-12 overflow-hidden shadow-sm">
              <button 
                onClick={() => handleQuantityChange('dec')}
                className="px-3 h-full hover:bg-accent text-muted-foreground transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="w-10 text-center font-semibold text-sm">
                {quantity}
              </span>
              <button 
                onClick={() => handleQuantityChange('inc')}
                className="px-3 h-full hover:bg-accent text-muted-foreground transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Botón Principal Añadir al carrito */}
            <Button 
              onClick={async () => {
                await addToCart(product.id, quantity);
                toast.success(`${product.name} agregado al carrito`);
              }}
              className="flex-1 h-12 bg-[#F2E300] hover:bg-[#D4C700] text-black font-extrabold text-sm rounded-lg shadow-sm transition-all tracking-wide"
            >
              Añadir al carrito
            </Button>
          </div>

          {/* Estado de Stock e Interacciones */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-1.5 text-sm font-bold text-green-600">
              <span>✓ En stock</span>
            </div>
          </div>

          {/* Banner de Marca (Hisense corporativo) */}
          <div className="flex items-center border border-border rounded-xl bg-card overflow-hidden shadow-sm">
            <div className="bg-[#008fa1] text-white font-black text-center py-5 px-4 text-xs tracking-wider shrink-0 w-24">
              HISENSE
            </div>
            <div className="p-4 text-xs text-muted-foreground leading-relaxed">
              <span className="font-bold text-foreground block uppercase text-[10px] tracking-wider mb-0.5">Marca Aliada</span>
              Imágenes inmersivas, funciones inteligentes, TVs premium accesibles.
            </div>
          </div>

          {/* Bloques de Información Desplegable / Garantías */}
          <div className="border border-border rounded-xl bg-card divide-y divide-border overflow-hidden text-xs shadow-sm">
            <div className="flex items-center justify-between p-4 hover:bg-accent/30 cursor-pointer transition-colors group">
              <div className="flex items-center gap-3 text-muted-foreground font-medium group-hover:text-foreground">
                <FileText size={16} className="text-primary/70" />
                <span>Este producto incluye garantía estándar.</span>
              </div>
              <span className="font-bold text-foreground text-[11px] flex items-center gap-0.5">Detalles <ChevronRight size={12} /></span>
            </div>
            <div className="flex items-center justify-between p-4 hover:bg-accent/30 cursor-pointer transition-colors group">
              <div className="flex items-center gap-3 text-muted-foreground font-medium group-hover:text-foreground">
                <Info size={16} className="text-primary/70" />
                <span>Información completa de entrega</span>
              </div>
              <span className="font-bold text-foreground text-[11px] flex items-center gap-0.5">Details <ChevronRight size={12} /></span>
            </div>
          </div>

          {/* Tarjetas inferiores de Características Complementarias */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Envío el mismo día */}
            <div className="border border-border rounded-xl bg-card p-4 text-center space-y-1 shadow-sm flex flex-col items-center justify-center">
              <div className="bg-amber-100 dark:bg-amber-950/40 p-2 rounded-full text-amber-600 mb-1">
                <Truck size={18} />
              </div>
              <h4 className="text-xs font-bold text-foreground">¡Entrega el mismo día!</h4>
              <p className="text-[10px] text-muted-foreground italic">*Excepto domingos y feriados.</p>
            </div>

            {/* Pasarela segura */}
            <div className="border border-border rounded-xl bg-card p-4 text-center space-y-2 shadow-sm flex flex-col items-center justify-center">
              <div className="bg-blue-100 dark:bg-blue-950/40 p-2 rounded-full text-blue-600">
                <ShieldCheck size={18} />
              </div>
              <h4 className="text-xs font-bold text-foreground">Pago Seguro Garantizado</h4>
              
              {/* Badges Falsos / Logos de pago estilizados */}
              <div className="flex items-center justify-center gap-1 flex-wrap pt-1">
                <span className="px-1.5 py-0.5 rounded border border-gray-200 text-[9px] font-black tracking-tight bg-white text-black">G Pay</span>
                <span className="px-1.5 py-0.5 rounded border border-gray-200 text-[9px] font-black tracking-tight bg-white text-black"> Pay</span>
                <span className="px-1.5 py-0.5 rounded border border-gray-200 text-[9px] font-bold tracking-tight bg-blue-800 text-white">VISA</span>
                <span className="px-1.5 py-0.5 rounded border border-gray-200 text-[9px] font-bold tracking-tight bg-orange-500 text-white">MC</span>
                <span className="px-1.5 py-0.5 rounded border border-gray-200 text-[9px] font-bold tracking-tight bg-blue-600 text-white">PayPal</span>
              </div>
            </div>

          </div>

          {/* Metadatos Finales */}
          <div className="pt-2 text-[11px] space-y-1.5 border-t border-border text-muted-foreground font-medium">
            <div className="flex justify-between">
              <span>SKU</span>
              <span className="text-foreground font-semibold">{product.sku || '100E7QPRO'}</span>
            </div>
            <div className="flex justify-between">
              <span>Etiquetas</span>
              <span className="text-foreground font-semibold uppercase bg-accent px-1.5 py-0.2 rounded text-[10px]">SALE</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <Skeleton className="h-5 w-64" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7">
          <Skeleton className="w-full aspect-square rounded-2xl" />
        </div>
        <div className="lg:col-span-5 space-y-6">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    </div>
  );
}