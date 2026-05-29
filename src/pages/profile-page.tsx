import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { profile as profileRequest } from '@/api/auth';
import { normalizeApiError } from '@/api/index';
import type { User } from '@/api/models';
import { useSession } from '@/hooks/use-session';

export default function ProfilePage() {
  const navigate = useNavigate();

  const storedUser = useSession((state) => state.user);

  const [user, setUser] = useState<User | null>(storedUser);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        setLoading(true);
        setError(null);

        const currentUser = await profileRequest();

        if (!isMounted) return;

        setUser(currentUser);
      } catch (errorData) {
        const apiError = normalizeApiError(errorData);

        if (!isMounted) return;

        setError(apiError.message || 'Sesión inválida');
        navigate('/login', { replace: true });
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Cargando perfil...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>{error}</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>No hay usuario autenticado.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <section className="w-full max-w-md rounded-2xl bg-white p-6 shadow">
        <h1 className="text-2xl font-bold mb-4">Mi perfil</h1>

        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500">Usuario</p>
            <p className="font-medium">{user.username || 'Sin username'}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>

          {'role' in user && (
            <div>
              <p className="text-sm text-gray-500">Rol</p>
              <p className="font-medium">{user.role}</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-3">
          <Link
            to="/"
            className="rounded-lg border px-4 py-2 text-sm font-medium"
          >
            Inicio
          </Link>

          <Link
            to="/logout"
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white"
          >
            Cerrar sesión
          </Link>
        </div>
      </section>
    </main>
  );
}