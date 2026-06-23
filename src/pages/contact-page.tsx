import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { Mail, Phone, Globe, ExternalLink } from "lucide-react"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSettings } from "@/hooks/api"
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

export default function ContactPage() {
  const { data: settings } = useSettings()
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })

  const socialLinks = settings?.social_links || []
  const contactEmail = settings?.contact_email
  const floatingWhatsapp = settings?.floating_whatsapp
  const orderWhatsapp = settings?.order_whatsapp

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    toast.info('Formulario de contacto próximamente disponible.')
    setForm({ name: '', email: '', phone: '', message: '' })
  }

  return (
    <div className="w-full bg-background transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-16">
        <section className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-black italic text-foreground tracking-tighter uppercase">
            Contáctanos
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Estamos aquí para ayudarte. Escríbenos y te responderemos a la brevedad.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <section className="space-y-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="grid gap-1.5 text-sm font-medium">
                  Nombre completo
                  <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Tu nombre" required />
                </label>
                <label className="grid gap-1.5 text-sm font-medium">
                  Correo electrónico
                  <Input type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder="correo@ejemplo.com" required />
                </label>
              </div>
              <label className="grid gap-1.5 text-sm font-medium">
                Teléfono (opcional)
                <Input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} placeholder="+58 412 123 4567" />
              </label>
              <label className="grid gap-1.5 text-sm font-medium">
                Mensaje
                <textarea value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} placeholder="Escribe tu mensaje aquí..." rows={5} required className="min-h-[120px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50" />
              </label>
              <Button type="submit" className="w-full sm:w-auto">Enviar mensaje</Button>
            </form>
          </section>

          <section className="space-y-6">
            <h2 className="text-lg font-bold">Información de contacto</h2>

            {contactEmail && (
              <a href={`mailto:${contactEmail}`} className="flex items-center gap-3 p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"><Mail size={18} /></div>
                <div><p className="text-sm font-medium">Correo electrónico</p><p className="text-sm text-muted-foreground">{contactEmail}</p></div>
              </a>
            )}

            {floatingWhatsapp && (
              <a href={`https://wa.me/${floatingWhatsapp.replace(/\+/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600"><Phone size={18} /></div>
                <div><p className="text-sm font-medium">WhatsApp</p><p className="text-sm text-muted-foreground">{floatingWhatsapp}</p></div>
              </a>
            )}

            {orderWhatsapp && orderWhatsapp !== floatingWhatsapp && (
              <a href={`https://wa.me/${orderWhatsapp.replace(/\+/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600"><Phone size={18} /></div>
                <div><p className="text-sm font-medium">WhatsApp (Pedidos)</p><p className="text-sm text-muted-foreground">{orderWhatsapp}</p></div>
              </a>
            )}

            {(!contactEmail && !floatingWhatsapp && !orderWhatsapp) && (
              <p className="text-sm text-muted-foreground italic">No hay información de contacto configurada. Ve al panel de administración para agregarla.</p>
            )}

            {socialLinks.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-base font-bold mt-6">Redes Sociales</h3>
                {socialLinks.map((link, i) => {
                  const name = link.name || link.platform || ""
                  const url = link.url || ""
                  const IconComponent = getSocialIcon(name)
                  return (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors group">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        {IconComponent ? <IconComponent size={20} /> : <Globe size={18} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium capitalize">{name || "Red social"}</p>
                        <p className="text-xs text-muted-foreground truncate">{url}</p>
                      </div>
                      <ExternalLink size={14} className="text-muted-foreground shrink-0" />
                    </a>
                  )
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
