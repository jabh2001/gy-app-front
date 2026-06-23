export default function AboutPage() {
  return (
    <div className="w-full bg-background transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-24">
        
        <section className="text-center space-y-8 max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black italic text-foreground tracking-tighter uppercase">
            Sirviendo desde 1993
          </h2>
          
          <div className="space-y-6 text-muted-foreground leading-relaxed text-sm md:text-base text-justify md:text-center">
            <p>
              Lo que comenzó como una humilde tienda de alquiler de videos en 1993 se ha convertido en uno de los nombres más confiables de entretenimiento y electrónica del hogar. A lo largo de los años, MegaTekk ha evolucionado para satisfacer las necesidades cambiantes de nuestros clientes, desde ofrecer cintas VHS hasta televisores inteligentes y sistemas de sonido de última generación.
            </p>
            <p>
              A principios de los 2000, nos expandimos a álbumes de CD, discos láser y DVD, y más tarde a la instalación de TV satelital para brindar a los clientes acceso a entretenimiento internacional, deportes, programas infantiles y contenido educativo.
            </p>
            <p>
              Hoy, MegaTekk es una tienda integral para lo último en tecnología y electrónica. Desde proyectores hasta sistemas de cine en casa de alta gama, nuestros productos son seleccionados por su calidad, confiabilidad y rendimiento. Servimos con orgullo a hogares, escuelas y negocios en todo el país, combinando décadas de experiencia con un toque personal.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="relative group">
            <div className="absolute -inset-4 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all"></div>
            <img 
              src="https://megatekk.mt/web/image/268563-6cb20502/Megatekk_Van.webp" 
              alt="Furgoneta de reparto" 
              className="relative w-full h-auto drop-shadow-2xl hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-3xl md:text-4xl font-black italic text-foreground leading-[0.9] tracking-tighter uppercase">
              Tú compras, nosotros entregamos en 24 horas
            </h3>
            
            <div className="space-y-4 text-muted-foreground text-sm md:text-base">
              <p>
                Creemos que un gran servicio comienza en el momento en que haces clic en "ordenar". Por eso nos enorgullece ofrecer entrega a domicilio rápida y confiable en todo el país en tan solo 24 horas.
              </p>
              <p>
                Tan pronto como recibimos tu pedido, nuestro equipo se comunicará por teléfono o correo para coordinar la entrega a tu conveniencia. Las entregas se realizan de lunes a viernes entre las 10:00 y las 20:00, y siempre avisamos con una ventana de 3 horas para que sepas cuándo esperarnos.
              </p>
              <p className="text-foreground">
                <span className="font-bold">El envío es gratis en todos los pedidos superiores a $50</span>. Si tu pedido requiere alguna disposición especial, te informaremos del costo adicional antes de proceder.
              </p>
              <p className="italic font-medium">Nuestro compromiso es simple: Tú compras. Nosotros entregamos. Rápido.</p>
              
              <p className="text-primary font-black italic uppercase tracking-widest pt-2">
                — Nicky Mangion, CEO de MegaTekk
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
