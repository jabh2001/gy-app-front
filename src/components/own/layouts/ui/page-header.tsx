import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User } from 'lucide-react';
import { CartDrawer } from '@/components/own/cart-drawer';
import { AccountDrawer } from '@/components/own/account-drawer';
import { useSession } from '@/hooks/use-session';
import GlobalSearch from '@/components/own/GlobalSearch';

function PageHeader() {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const user = useSession(session => session.user);

    return (
            <header className="bg-black/95 text-white shadow-sm">
                <div className="max-w-7xl mx-auto flex flex-col gap-3 px-4 py-4 md:px-12">
                    <div className="flex items-center justify-between gap-3">
                        <Link to="/" className="text-3xl font-black italic tracking-tighter">
                            MEGATEKK
                        </Link>

                        <div className="flex items-center gap-2 lg:gap-4 lg:hidden">
                            <button
                                type="button"
                                onClick={() => setIsCartOpen(true)}
                                aria-label="Abrir carrito"
                                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white transition hover:border-primary hover:bg-white/10"
                            >
                                <ShoppingCart size={20} />
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsAccountOpen(true)}
                                aria-label="Abrir cuenta"
                                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white transition hover:border-primary hover:bg-white/10"
                            >
                                <User size={20} />
                            </button>
                        </div>
                        <div className="hidden lg:flex items-center gap-4">
                            <GlobalSearch />

                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsCartOpen(true)}
                                    className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-left transition hover:border-primary hover:bg-white/10"
                                >
                                    <div className="relative rounded-xl border border-white/15 bg-black/15 p-2">
                                        <ShoppingCart size={18} />
                                        <span className="absolute -top-2 -right-2 rounded-full bg-primary px-1.5 text-[10px] font-bold text-black">0</span>
                                    </div>
                                    <div className="text-left text-xs">
                                        <p className="text-slate-300">Carrito</p>
                                        <p className="font-semibold text-white">€ 0.00</p>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setIsAccountOpen(true)}
                                    className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 px-4 py-3 transition hover:border-primary hover:bg-white/10"
                                >
                                    <User size={20} className="text-white" />
                                    <div className="text-left text-xs">
                                        <p className="text-slate-400">{user ? 'Hola,' : 'Cuenta'}</p>
                                        <p className="font-semibold text-white">{user?.username ?? 'Invitado'}</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
        
                <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
                <AccountDrawer 
                    isOpen={isAccountOpen} 
                    onClose={() => setIsAccountOpen(false)} 
                    loginPath="/login"
                    registerPath="/register"
                    cartPath="/cart"
                    profilePath='/profile'
                    logoutPath='/logout'
                />
            </header>
    )
}

export {
    PageHeader
}