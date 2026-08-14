import { useEffect, useState } from "react"
import { Search, User, Home, Zap, X } from 'lucide-react'
import { Link } from "react-router-dom"
import GlobalSearch from "@/components/own/GlobalSearch"
import { useSession } from "@/hooks/use-session"
import { useBackAndEscape } from "@/hooks/use-back-and-scape"

function BottomBarMobile() {
    const user = useSession((s) => s.user)
    const [searchOpen, setSearchOpen] = useState(false)

    useEffect(() => {
        if (searchOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }
    }, [searchOpen])
    useBackAndEscape(() => setSearchOpen(false), searchOpen)

    return (
        <>
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-primary text-white border-t border-white/10 flex justify-around py-3 z-50 shadow-[0_-5px_15px_rgba(0,0,0,0.12)]">
                <Link to="/" className="flex flex-col items-center gap-1 text-[10px] font-bold uppercase text-white/90 hover:text-white">
                    <Home size={20} />
                    <span>Inicio</span>
                </Link>
                <button onClick={() => setSearchOpen(true)} className="flex flex-col items-center gap-1 text-[10px] font-bold uppercase text-white/70 hover:text-white">
                    <Search size={20} />
                    <span>Buscar</span>
                </button>
                <Link to="/shop" className="flex flex-col items-center gap-1 text-[10px] font-bold uppercase text-white/70 hover:text-white">
                    <Zap size={20} />
                    <span>Destacadas</span>
                </Link>
                {user ? (
                    <Link to="/profile" className="flex flex-col items-center gap-1 text-[10px] font-bold uppercase text-white/70 hover:text-white">
                        <User size={20} />
                        <span>Perfil</span>
                    </Link>
                ) : (
                    <Link to="/login" className="flex flex-col items-center gap-1 text-[10px] font-bold uppercase text-white/70 hover:text-white">
                        <User size={20} />
                        <span>Iniciar Sesión</span>
                    </Link>
                )}
            </div>

            {searchOpen && (
                <div className="fixed inset-0 z-[100] flex flex-col bg-black/60 backdrop-blur-sm w-full h-full">
                    <div className="flex items-start justify-between bg-background p-2 w-full">
                        <div className="flex-1">
                            <GlobalSearch
                                category={false}
                                showCategoryList={false}
                                showProductList={true}
                                onSearchSubmit={(term) => {
                                    setTimeout(() => {
                                        setSearchOpen(false)
                                    }, 100)
                                    // setSearchOpen(false)
                                    console.log("Search submitted " + term)
                                }}
                            />
                        </div>
                        <button
                            onClick={() => setSearchOpen(false)}
                            className="ml-2 mt-1 text-muted-foreground hover:text-foreground"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

export { BottomBarMobile }
