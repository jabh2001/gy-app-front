import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useFeatured, useActive, useParent } from "@/hooks/api/use-query-params"
import { SlidersHorizontal } from "lucide-react"

type FilterValue = "true" | "false" | "all";
type ParentValue = "none" | "all";
type FilterType = "active" | "featured" | "parent"

type FilterSelectProps = {
    onSelect?: ({ filter, value }: { filter: FilterType, value: string }) => void
}

export default function FilterSelect({ onSelect }: FilterSelectProps) {
    const [featured, setFeatured] = useFeatured()
    const [active, setActive] = useActive()
    const [parent, setParent] = useParent()

    // Manejadores específicos para actualizar la URL y disparar el callback externo
    const handleActiveChange = (value: string) => {
        const val = value as FilterValue;
        setActive(val);
        onSelect?.({ filter: "active", value: val });
    };

    const handleFeaturedChange = (value: string) => {
        const val = value as FilterValue;
        setFeatured(val);
        onSelect?.({ filter: "featured", value: val });
    };

    const handleParentChange = (value: string) => {
        const val = value as ParentValue;
        setParent(val);
        onSelect?.({ filter: "parent", value: val });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-11 rounded-2xl bg-background">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filtros
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="start">{/* --- GRUPO: ACTIVO --- */}
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Estado Activo</DropdownMenuLabel>
                    <DropdownMenuRadioGroup value={active} onValueChange={handleActiveChange}>
                        <DropdownMenuRadioItem value="true">Activas</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="false">Inactivas</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="all">Todas</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
                
                <DropdownMenuSeparator />

                {/* --- GRUPO: DESTACADO --- */}
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Destacados</DropdownMenuLabel>
                    <DropdownMenuRadioGroup value={featured} onValueChange={handleFeaturedChange}>
                        <DropdownMenuRadioItem value="true">Destacadas</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="false">No destacadas</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="all">Todas</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
                
                <DropdownMenuSeparator />
                
                {/* --- GRUPO: EN OFERTA --- */}
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Sub categorías</DropdownMenuLabel>
                    <DropdownMenuRadioGroup value={parent} onValueChange={handleParentChange}>
                        <DropdownMenuRadioItem value="none">Solo principales</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="all">Todas</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}