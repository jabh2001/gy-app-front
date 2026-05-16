export default function AboutPage() {
  return (
    <div className="w-full bg-background transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-24">
        
        {/* Parte Superior: Historia */}
        <section className="text-center space-y-8 max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black italic text-foreground tracking-tighter uppercase">
            Serving Malta Since 1993
          </h2>
          
          <div className="space-y-6 text-muted-foreground leading-relaxed text-sm md:text-base text-justify md:text-center">
            <p>
              What began as a humble video rental store in 1993 has grown into one of Malta’s most trusted names in home entertainment and electronics. Over the years, MegaTekk has evolved to meet the changing needs of our customers — from offering VHS tapes to cutting-edge smart TVs and sound systems.
            </p>
            <p>
              In the early 2000s, we expanded into CD albums, laser discs, and DVDs, later moving into satellite TV installation to provide customers with access to international entertainment, sports, kids’ shows, and educational content.
            </p>
            <p>
              Today, MegaTekk is a one-stop shop for the latest in tech and electronics. From projectors to high-end home theatre systems, our products are handpicked for quality, reliability, and performance. We proudly serve households, schools, and businesses across Malta and Gozo, combining decades of experience with a personal touch.
            </p>
          </div>
        </section>

        {/* Parte Inferior: Delivery con Imagen y Texto */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Imagen de la Van (Referencia: image_0.png) */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all"></div>
            <img 
              src="https://megatekk.mt/web/image/268563-6cb20502/Megatekk_Van.webp" 
              alt="Megatekk Delivery Van" 
              className="relative w-full h-auto drop-shadow-2xl hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Texto de Delivery */}
          <div className="space-y-6">
            <h3 className="text-3xl md:text-4xl font-black italic text-foreground leading-[0.9] tracking-tighter uppercase">
              You Shop, We Deliver Anywhere in Malta Within 24 Hours
            </h3>
            
            <div className="space-y-4 text-muted-foreground text-sm md:text-base">
              <p>
                At MegaTekk Malta, we believe great service starts the moment you click "order." That’s why we’re proud to offer fast and reliable home delivery to all corners of Malta and Gozo — within just 24 hours.
              </p>
              <p>
                As soon as we receive your order, our team will reach out by phone or email to arrange delivery at your convenience. Deliveries take place Monday to Friday between 10:00 and 20:00, and we always provide a 3-hour delivery window so you know when to expect us.
              </p>
              <p className="text-foreground">
                <span className="font-bold">Delivery is free on all orders over €50</span> across Malta and Gozo. Should your order require any special arrangements — such as a crane or elevated delivery — we’ll inform you of the additional cost before proceeding.
              </p>
              <p className="italic font-medium">Our commitment is simple: You shop. We deliver. Fast.</p>
              
              <p className="text-primary font-black italic uppercase tracking-widest pt-2">
                — Nicky Mangion, CEO of MegaTekk Malta
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}