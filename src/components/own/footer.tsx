import { useSettings } from "@/hooks/api";
import {
  FacebookLogoIcon,
  InstagramLogoIcon,
  TwitterLogoIcon,
  TiktokLogoIcon,
  YoutubeLogoIcon,
  LinkedinLogoIcon,
  WhatsappLogoIcon,
  TelegramLogoIcon,
  GithubLogoIcon,
  DiscordLogoIcon,
} from "@phosphor-icons/react"
import { Globe } from "lucide-react"


export default function Footer() {
  const { data: settings } = useSettings()
  const floatingWhatsapp = settings?.floating_whatsapp
  const socialLinks = settings?.social_links || []

  return (
    <footer className="bg-muted text-muted-foreground pt-12 pb-6 px-4 md:px-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        <div className="w-full text-center mb-12 border-b border-border pb-4">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-foreground text-sm font-bold hover:underline transition-all"
          >
            Volver al principio
          </button>
        </div>

        <div className="hidden md:grid grid-cols-3 gap-12 mb-16">
          <div className="space-y-6">
            <h4 className="text-foreground font-bold uppercase tracking-tight">Conócenos</h4>
            <p className="text-sm leading-relaxed">
              Tu hogar, equipado con la mejor tecnología.
              Somos tu tienda de confianza en electrodomésticos.
              Encuentra neveras, lavadoras, equipos de cocina y soluciones para el hogar de las mejores marcas con garantía y envío a domicilio.
            </p>
            <p className="text-sm font-medium">
              Av. Principal, Centro Comercial, Piso 1. Caracas, Venezuela.
            </p>
            {socialLinks.length > 0 && (
              <div className="space-y-3 flex gap-4">
                {socialLinks.map((link, i) => {
                  const IconComponent = getSocialIcon(link.name || link.platform || "")
                  return (
                    <a key={i} href={link.url || ""} target="_blank" rel="noopener noreferrer" className="">
                      {IconComponent ? <IconComponent size={36} /> : <Globe size={18} />}
                    </a>
                  )
                })}
              </div>
            )}
          </div>

          <div className="space-y-6"></div>

          <div className="space-y-6">
            
          </div>
        </div>

        <div className="md:hidden space-y-4 mb-8">
          <div className="space-y-4">
            <h4 className="text-foreground font-bold uppercase tracking-tight">Conócenos</h4>
            <p className="text-sm leading-relaxed">
              Tu hogar, equipado con la mejor tecnología.
              Somos tu tienda de confianza en electrodomésticos.
              Encuentra neveras, lavadoras, equipos de cocina y soluciones para el hogar de las mejores marcas con garantía y envío a domicilio.
            </p>
            <p className="text-xs">
              Av. Principal, Centro Comercial, Piso 1. Caracas, Venezuela.
            </p>
            
            {socialLinks.length > 0 && (
              <div className="space-y-3 flex gap-4">
                {socialLinks.map((link, i) => {
                  const IconComponent = getSocialIcon(link.name || link.platform || "")
                  return (
                    <a key={i} href={link.url || ""} target="_blank" rel="noopener noreferrer" className="">
                      {IconComponent ? <IconComponent size={36} /> : <Globe size={18} />}
                    </a>
                  )
                })}
              </div>
            )}
          </div>

        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] md:text-xs text-slate-500">
            Copyright &copy;2026. Todos los derechos reservados.
          </p>
        </div>
      </div>

      {floatingWhatsapp && (
        <a
          href={`https://wa.me/${floatingWhatsapp.replace(/[^0-9]/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] fixed bottom-20 lg:bottom-6 right-6 z-50 text-white p-3 rounded-full shadow-2xl hover:scale-110 transition-transform"
        >
          <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        </a>
      )}
    </footer>
  );
}


const SOCIAL_ICON_MAP: Record<string, React.ComponentType<{ size?: number }>> = {
  facebook: FacebookLogoIcon,
  instagram: InstagramLogoIcon,
  twitter: TwitterLogoIcon,
  tiktok: TiktokLogoIcon,
  youtube: YoutubeLogoIcon,
  linkedin: LinkedinLogoIcon,
  whatsapp: WhatsappLogoIcon,
  telegram: TelegramLogoIcon,
  github: GithubLogoIcon,
  discord: DiscordLogoIcon,
}

function getSocialIcon(name: string): React.ComponentType<{ size?: number }> | null {
  const key = name.toLowerCase()
  return SOCIAL_ICON_MAP[key] || null
}