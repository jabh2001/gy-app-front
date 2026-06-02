import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    toast.info('Formulario de contacto próximamente disponible.');
    setForm({ name: '', email: '', phone: '', message: '' });
  };

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
                  <Input
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Tu nombre"
                    required
                  />
                </label>
                <label className="grid gap-1.5 text-sm font-medium">
                  Correo electrónico
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    placeholder="correo@ejemplo.com"
                    required
                  />
                </label>
              </div>
              <label className="grid gap-1.5 text-sm font-medium">
                Teléfono (opcional)
                <Input
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="+58 412 123 4567"
                />
              </label>
              <label className="grid gap-1.5 text-sm font-medium">
                Mensaje
                <textarea
                  value={form.message}
                  onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                  placeholder="Escribe tu mensaje aquí..."
                  rows={5}
                  required
                  className="min-h-[120px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              </label>
              <Button type="submit" className="w-full sm:w-auto">
                Enviar mensaje
              </Button>
            </form>
          </section>

          <section className="space-y-6">
            <div className="space-y-4">
              <ContactInfo
                icon={<MapPin className="size-5 text-primary" />}
                title="Dirección"
                content="Qormi - 93 Ellul Mercer Ħal, Qormi. QRM 2680"
              />
              <ContactInfo
                icon={<Phone className="size-5 text-primary" />}
                title="Teléfono"
                content="+356 1234 5678"
              />
              <ContactInfo
                icon={<Mail className="size-5 text-primary" />}
                title="Correo electrónico"
                content="info@megatekk.mt"
              />
              <ContactInfo
                icon={<Clock className="size-5 text-primary" />}
                title="Horario"
                content="Lunes a Viernes: 10:00 - 20:00 | Sábados: 10:00 - 18:00"
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function ContactInfo({ icon, title, content }: { icon: React.ReactNode; title: string; content: string }) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-4">
      <div className="mt-0.5">{icon}</div>
      <div>
        <h4 className="font-semibold text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground">{content}</p>
      </div>
    </div>
  );
}
