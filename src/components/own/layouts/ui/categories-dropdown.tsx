import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCategories } from "@/hooks/api";
import { ChevronDown } from 'lucide-react';
import { Link } from "react-router-dom";

export default function CategoriesDropdown(){
    const { data } = useCategories({ featured:"true" })
    return (
        <div className="relative hidden sm:inline-flex">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-sm border border-white/15 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:border-primary hover:text-white"
                    >
                        Categorías
                        <ChevronDown size={16} />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40" align="start">
                    <DropdownMenuGroup>
                        <DropdownMenuLabel>Más destacadas</DropdownMenuLabel>
                        {data?.items?.map((category) => (
                            <Link to={`/shop/category/${category.slug}`}>
                                <DropdownMenuItem key={"hdd_" + category.slug} className="cursor-pointer">
                                    {category.name}
                                </DropdownMenuItem>
                            </Link>
                        ))}
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}