import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { BottomBarMobile } from '@/components/own/layouts/ui/bottom-bar-mobile';
import { PageHeader } from '@/components/own/layouts/ui/page-header';
import { AdminFloatingButton } from '@/components/own/admin-floating-button';
import Footer from '@/components/own/footer';
import { useTitleStore } from '@/hooks/use-title';
import { useEffect } from 'react';
import { useSession } from '@/hooks/use-session';
import CategoriesDropdown from './ui/categories-dropdown';
import { useSettings } from '@/hooks/api';


export default function MainLayout() {
    const hasCheckedSession = useSession((state) => state.hasCheckedSession);
    const checkSession = useSession((state) => state.checkSession);
    const user = useSession((state) => state.user);
    const navigate = useNavigate()
    const title = useTitleStore((state) => state.title)
    const { data: settings } = useSettings()
    const siteName = settings?.site_name || 'Tienda'

    useEffect(() => {
        hasCheckedSession && !user && navigate("/login")
    }, [user])

    useEffect(() => {
        checkSession();
    }, [checkSession]);

    useEffect(() => {
        document.title = title ? `${title} | ${siteName}` : siteName
    }, [title, siteName])

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <AdminFloatingButton />
            <PageHeader />
            <nav className="border-t border-white/10 bg-black/90">
                <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-6 px-4 py-3 text-slate-200">
                    <CategoriesDropdown />
                    <div className="flex flex-wrap items-center justify-center gap-6">
                        <HeaderLink to="/">Inicio</HeaderLink>
                        <HeaderLink to="/shop">Tienda</HeaderLink>
                        <HeaderLink to="/about">Nosotros</HeaderLink>
                        <HeaderLink to="/contact">Contacto</HeaderLink>
                    </div>
                </div>
            </nav>

            {/* 3. Contenido de la Página */}
            <main className="flex-grow">
                <Outlet />
            </main>

            <Footer />
            {/* 4. Barra de Navegación Inferior (Mobile) */}
            <BottomBarMobile />
        </div>
    );
}

const HeaderLink = ({ to, children }: { to: string, children?: any }) => {
    return (
        <NavLink
            end
            to={to}
            className={({ isActive }) =>
                `relative inline-flex items-center gap-1 text-sm font-semibold transition ${isActive ? 'text-primary' : 'text-slate-300 hover:text-white'
                } after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full ${isActive ? 'after:w-full' : ''
                }`
            }>

            {children}
        </NavLink>
    )
}