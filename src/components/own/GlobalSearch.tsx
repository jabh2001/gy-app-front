import { useState, useEffect, useRef, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Search, X, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/use-debounce"
import { useSearchSuggestions } from "@/hooks/api/useSearch"

export default function GlobalSearch() {
    const [searchTerm, setSearchTerm] = useState("")
    const searchTermTrim = useMemo(() => searchTerm.trim(), [searchTerm])
    const [isOpen, setIsOpen] = useState(false)
    const [isSearching, setIsSearching] = useState(false)

    const containerRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()

    // Único antirrebote del flujo (500ms es perfecto)
    const debouncedSearch = useDebounce(searchTerm, 500)

    // Traemos también 'isFetching' para controlar cargas en segundo plano
    const { data, isLoading, isFetching } = useSearchSuggestions(debouncedSearch, { 
        enabled: isOpen && debouncedSearch.trim().length >= 2 
    })

    // Control del spinner local mientras el usuario escribe
    useEffect(() => {
        setIsSearching(searchTerm !== debouncedSearch)
    }, [searchTerm, debouncedSearch])

    // Cierra el dropdown si hacen clic fuera
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleOutsideClick)
        return () => document.removeEventListener("mousedown", handleOutsideClick)
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchTerm(value)
        setIsOpen(searchTermTrim.length > 0)
    }

    const handleClear = () => {
        setSearchTerm("")
        setIsOpen(false)
    }

    const handleProductClick = (id: number | string) => {
        navigate(`/shop/${id}`)
        handleClear()
    }

    const handleCategoryClick = (id: number | string) => {
        navigate(`/shop/category/${id}`)
        handleClear()
    }
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchTermTrim.length > 0) {
            navigate(`/shop/search/${encodeURIComponent(searchTermTrim)}`)
            setIsOpen(false) 
        } else {
            navigate(`/shop`)
            setIsOpen(false) 
        }
    }

    // Condición real de carga: o está escribiendo, o react-query está trayendo los datos
    const showLoader = isSearching || isLoading || isFetching
    const showProducts = data && data.products.length > 0 
    const showCategories = data && data.categories.length > 0
    const showData = showProducts || showCategories
    const showXL = showProducts && showCategories

    return (
        <div className="relative w-full" ref={containerRef}>
            {/* Input de Búsqueda */}
            <form className="relative flex items-center min-w-[520px]" onSubmit={handleSearchSubmit}>
                <Input
                    type="text"
                    placeholder="Buscar productos, categorías y más..."
                    className="w-full rounded-xl border border-slate-600 bg-white text-slate-900 px-5 py-4 shadow-sm focus-visible:ring-primary"
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={() => {
                        if (searchTermTrim.length > 0) setIsOpen(true)
                    }}
                />
            
                {searchTerm && (
                    <button
                        onClick={handleClear}
                        className="absolute right-10 p-1 rounded-full hover:bg-accent text-muted-foreground transition-colors"
                        type="button"
                    >
                        <X className="size-4" />
                    </button>
                )}
                <Search className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" size={22} />
            </form>

            {/* Menú Desplegable (Dropdown) */}
            {isOpen && searchTermTrim.length >= 2 && (
                <div className={`${showXL && 'w-[150%]'} absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-xl z-50 overflow-hidden max-h-[400px] overflow-y-auto bg-white text-slate-900`}>
                    
                    {showLoader ? <SearchLoaderHeader /> : showData ? (
                        <div className={`${showXL && 'grid grid-cols-[1fr_2fr]'} py-2`}>
                            {/* SECCIÓN DE CATEGORÍAS */}
                            {showCategories && (
                                <div className="mb-2">
                                    <span className="block px-4 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        Categorías sugeridas
                                    </span>
                                    <ul>
                                        {data.categories.map((cat) => (
                                            <li key={cat.id}>
                                                <button
                                                    onClick={() => handleCategoryClick(cat.slug)}
                                                    className="w-full uppercase px-4 py-2 text-sm text-left font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                                                >
                                                    {cat.name}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* SECCIÓN DE PRODUCTOS */}
                            {showProducts && (
                                <div>
                                    <span className="block px-4 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        Productos
                                    </span>
                                    <ul>
                                        {data.products.map((item) => (
                                            <li key={item.id}>
                                                <button
                                                    onClick={() => handleProductClick(item.id)}
                                                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-100 transition-colors text-left"
                                                >
                                                    <div className="bg-slate-100 p-1 rounded-md size-10 flex items-center justify-center overflow-hidden border">
                                                        {item.main_image ? (
                                                            <img src={item.main_image_url_path?? ""} alt="" className="object-cover size-full" />
                                                        ) : (
                                                            <Search className="size-4 text-slate-400" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-900">{item.name}</p>
                                                        {item.sku && <p className="text-xs text-slate-400">SKU: {item.sku}</p>}
                                                    </div>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : <SearchNotFound search={debouncedSearch} /> }
                </div>
            )}
        </div>
    )
}

const SearchLoaderHeader = () => (
    <div className="p-8 flex flex-col items-center justify-center text-muted-foreground">
        <Loader2 className="size-6 animate-spin mb-2 text-primary" />
        <p className="text-sm">Buscando...</p>
    </div>

)
const SearchNotFound = ({ search }:{ search:string}) => (
    <div className="p-8 text-center text-muted-foreground">
        <p className="text-sm">No se encontraron resultados para "{search}"</p>
    </div>
)