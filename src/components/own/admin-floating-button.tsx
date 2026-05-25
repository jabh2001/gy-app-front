import { useSession } from '@/hooks/use-session';
import { Settings } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

export function AdminFloatingButton() {
    const hasRole = useSession(state => state.hasRole);
    const isAdmin = useMemo(() => hasRole('admin'), [hasRole]);

    return (
        <div className={`${isAdmin ? 'block' : 'hidden'} group fixed top-16 md:top-4 left-0 z-50 flex items-center justify-end`}>

            <div className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-2 py-3 rounded-r-md shadow-md cursor-pointer transition-transform duration-300 transform group-hover:-translate-x-full -translate-x-full md:-translate-x-0 select-none">
                ADMIN
            </div>

            <Link
                to="/admin"
                className="absolute left-2 bg-slate-900 text-white p-3 rounded-xl shadow-xl flex items-center gap-2 border border-slate-800 transition-all duration-300 ease-in-out md:opacity-0 scale-95 md:-translate-x-full group-hover:opacity-100 group-hover:scale-100 group-hover:-translate-x-0"
            >
                <Settings className="w-5 h-5 animate-spin-slow" />
            </Link>

        </div>
    );
}