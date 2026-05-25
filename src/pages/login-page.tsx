import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/use-session';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, status, error } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');

    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      setMessage('No se pudo iniciar sesión. Revisa tus datos e intenta de nuevo.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-slate-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col gap-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl md:flex-row md:p-10">
          <div className="space-y-6 md:w-1/2">
            <div>
              <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">Bienvenido de nuevo</span>
              <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900">Inicia sesión</h1>
              <p className="mt-4 max-w-md text-sm text-slate-600">Ingresa a tu cuenta para administrar tu carrito, ver tus pedidos y tener acceso exclusivo a promociones.</p>
            </div>

            <div className="rounded-3xl bg-slate-100 p-5 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">¿No tienes cuenta?</p>
              <p className="mt-2">Regístrate en segundos y comienza a comprar con mejores beneficios.</p>
              <Link to="/register" className="mt-4 inline-flex items-center rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">Crear cuenta</Link>
            </div>
          </div>

          <div className="md:w-1/2">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Correo electrónico</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="hola@ejemplo.com"
                  className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Contraseña</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900"
                  required
                />
              </div>

              {message || error ? (
                <p className="rounded-2xl bg-red-50 p-3 text-sm text-red-700">{message || error}</p>
              ) : null}

              <Button type="submit" className="w-full rounded-3xl bg-black px-5 py-3 text-sm font-bold text-white hover:bg-slate-800" disabled={status === 'loading'}>
                {status === 'loading' ? 'Ingresando...' : 'Iniciar sesión'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
