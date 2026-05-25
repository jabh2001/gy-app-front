import { Search, User, Home, Zap } from 'lucide-react';

function BottomBarMobile() {
    return (

        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black text-white border-t border-white/10 flex justify-around py-3 z-50 shadow-[0_-5px_15px_rgba(0,0,0,0.12)]">
            <div className="flex flex-col items-center gap-1 text-[10px] font-bold uppercase text-white/90 hover:text-white">
                <Home size={20} />
                <span>Inicio</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-[10px] font-bold uppercase text-white/70 hover:text-white">
                <Search size={20} />
                <span>Buscar</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-[10px] font-bold uppercase text-white/70 hover:text-white">
                <Zap size={20} />
                <span>Ofertas</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-[10px] font-bold uppercase text-white/70 hover:text-white">
                <User size={20} />
                <span>Cuenta</span>
            </div>
        </div>
    )
}

export { BottomBarMobile };