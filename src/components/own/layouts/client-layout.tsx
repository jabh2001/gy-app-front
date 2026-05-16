import { useState } from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { Search, ShoppingCart, User, ChevronDown, Home, Zap } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CartDrawer } from '@/components/own/cart-drawer';
import Footer from '@/components/own/footer';

export default function MainLayout() {
    const [isCartOpen, setIsCartOpen] = useState(false);
    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* 1. Header Superior Negro */}
            <header className="bg-black py-4 px-4 md:px-12 text-white">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                    {/* Logo Megatekk */}
                    <Link to="/" className="shrink-0 flex items-center gap-1">
                        <div className="text-primary text-3xl font-black italic tracking-tighter flex items-center">
                            <Zap className="fill-primary" size={32} /> MEGATEKK
                        </div>
                    </Link>

                    {/* Buscador Central (Desktop) */}
                    <div className="hidden md:flex flex-1 max-w-xl relative">
                        <Input
                            placeholder="Search products..."
                            className="w-full h-10 rounded-sm bg-white text-black pr-10 focus-visible:ring-primary"
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    </div>

                    {/* Acciones de Usuario (Desktop) */}
                    <div className="hidden lg:flex items-center gap-6">
                        <div onClick={() => setIsCartOpen(true)} className="flex items-center gap-3 group cursor-pointer border-r border-gray-800 pr-4">
                            <div className="relative border-2 border-white rounded-full p-2 group-hover:border-primary group-hover:text-primary transition-colors">
                                <ShoppingCart size={20} />
                                <span className="absolute -top-2 -right-2 bg-primary text-black text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">0</span>
                            </div>
                            <div className="text-xs">
                                <p className="text-gray-400">My Cart</p>
                                <p className="font-bold">€ 0.00</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 cursor-pointer group">
                            <User size={24} className="group-hover:text-primary transition-colors" />
                            <div className="text-xs">
                                <p className="text-gray-400">Guest</p>
                                <p className="font-bold">My Account</p>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Cart Icon */}
                    <div className="md:hidden relative border-2 border-white rounded-full p-2">
                        <ShoppingCart size={20} />
                        <span className="absolute -top-2 -right-2 bg-primary text-black text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">0</span>
                    </div>
                </div>
            </header>

            {/* 2. Barra de Navegación Blanca (Categorías) */}
            <nav className="border-b bg-white hidden md:block">
                <div className="max-w-7xl mx-auto px-4 md:px-12 flex items-center justify-between h-14">
                    <div className="flex items-center gap-8 text-[13px] font-bold uppercase tracking-tight">
                        <button className="flex items-center gap-1 hover:text-primary transition-colors">
                            All Categories <ChevronDown size={14} />
                        </button>
                        <HeaderLink to="/">Home</HeaderLink>
                        <HeaderLink to="/shop">Shop</HeaderLink>
                        <HeaderLink to="/about">About Us</HeaderLink>
                        <HeaderLink to="/contact">Contact Us</HeaderLink>
                    </div>

                    <Button className="bg-[#FF1A1A] hover:bg-red-700 text-white rounded-full px-6 h-8 text-xs font-bold uppercase italic">
                        🔥 Sale
                    </Button>
                </div>
            </nav>

            {/* 3. Contenido de la Página */}
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
            {/* 4. Barra de Navegación Inferior (Mobile) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-3 z-50 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
                <div className="flex flex-col items-center gap-1 text-[10px] font-bold uppercase">
                    <Home size={20} className="text-primary" />
                    <span>Home</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-[10px] font-bold uppercase text-gray-400">
                    <Search size={20} />
                    <span>Search</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-[10px] font-bold uppercase text-gray-400">
                    <Zap size={20} />
                    <span>Offers</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-[10px] font-bold uppercase text-gray-400">
                    <User size={20} />
                    <span>Account</span>
                </div>
            </div>
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </div>
    );
}

const HeaderLink = ({ to, children }:{ to:string, children?:any }) => {
    return (
        <NavLink  
            end
            to={to}
            className={({ isActive }) => isActive ? "text-primary border-b-2 border-primary h-14 flex items-center" : "hover:text-primary h-14 flex items-center"}
        >
            {children}
        </NavLink>
    )
}