import { CrossIcon, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";


export default function Footer() {

  return (
    <footer className="bg-muted text-muted-foreground pt-12 pb-6 px-4 md:px-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        {/* Botón Volver al principio */}
        <div className="w-full text-center mb-12 border-b border-border pb-4">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-foreground text-sm font-bold hover:underline transition-all"
          >
            Volver al principio
          </button>
        </div>

        {/* Contenido Principal (Desktop) */}
        <div className="hidden md:grid grid-cols-3 gap-12 mb-16">
          {/* Conócenos */}
          <div className="space-y-6">
            <h4 className="text-foreground font-bold uppercase tracking-tight">Conócenos</h4>
            <p className="text-sm leading-relaxed">
               Malta’s one-stop electronics store, bringing you the latest tech at unbeatable prices. From gadgets to gaming, we deliver same-day across the island.
            </p>
            <p className="text-sm font-medium">
               Qormi - 93 Ellul Mercer Ħal, Qormi. QRM 2680.
                Bugibba - Wingnacourt, San Pawl il-Baħar. 
                VAT Number: MT16528323
            </p>
            <div className="flex gap-4 text-foreground">
              <CrossIcon className="cursor-pointer hover:text-primary transition-colors" size={20} />
              <CrossIcon className="cursor-pointer hover:text-primary transition-colors" size={20} />
              <CrossIcon className="cursor-pointer hover:text-primary transition-colors" size={20} />
            </div>
          </div>

          {/* Información */}
          <div className="space-y-6"></div>

          {/* Suscríbete */}
          <div className="space-y-6">
            <h4 className="text-foreground font-bold uppercase tracking-tight">Suscríbete</h4>
            <p className="text-sm">Regístrese para recibir ofertas exclusivas, historias originales, eventos y más.</p>
            <div className="relative group max-w-xs">
              <Input 
                placeholder="Su correo electrónico" 
                className="bg-background border-border rounded-full pr-12 focus-visible:ring-primary h-12"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground group-hover:translate-x-1 transition-transform">
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Contenido Principal (Mobile Accordion - Ref: image_6c4f82.png) */}
        <div className="md:hidden space-y-4 mb-8">
          <div className="space-y-4">
            <h4 className="text-foreground font-bold uppercase tracking-tight">Conócenos</h4>
            <p className="text-sm leading-relaxed">
               Malta’s one-stop electronics store, bringing you the latest tech at unbeatable prices. From gadgets to gaming, we deliver same-day across the island.
            </p>
            <p className="text-xs">
                Qormi - 93 Ellul Mercer Ħal, Qormi. QRM 2680.
                Bugibba - Wingnacourt, San Pawl il-Baħar. 
                VAT Number: MT16528323
            </p>
            <div className="flex gap-6 text-foreground pt-2">
              <CrossIcon size={24} /> <CrossIcon size={24} /> <CrossIcon size={24} />
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] md:text-xs">
            Copyright ©2026 Megatekk Malta. Developed by Humboldtech. MegaTekk Plug Into Tomorrow and the MegaTekk logo are trademarks of MegaTekk.  EU trade mark (EUTM) application no. 019285343. All rights reserved.
          </p>
          <div className="bg-white p-1 rounded-sm shadow-sm">
             {/* Icono de PayPal como en la captura */}
             <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" />
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <button className="fixed bottom-6 right-6 bg-[#25D366] text-white p-3 rounded-full shadow-2xl z-50 hover:scale-110 transition-transform">
        <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </button>
    </footer>
  );
}