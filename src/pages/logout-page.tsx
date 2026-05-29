import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/use-session';

export default function LogoutPage() {
  const navigate = useNavigate();
  const logout = useSession((state) => state.logout);

  const [message, setMessage] = useState('Cerrando sesión...');

  useEffect(() => {
    let isMounted = true;

    async function handleLogout() {
      try {
        await logout();

        if (!isMounted) return;

        setMessage('Sesión cerrada correctamente.');
        navigate('/login', { replace: true });
      } catch {
        if (!isMounted) return;

        setMessage('No se pudo cerrar sesión correctamente.');
        navigate('/login', { replace: true });
      }
    }

    handleLogout();

    return () => {
      isMounted = false;
    };
  }, [logout, navigate]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <p>{message}</p>
    </main>
  );
}