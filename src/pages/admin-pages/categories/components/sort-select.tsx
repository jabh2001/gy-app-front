import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useOrder } from "@/hooks/api/use-query-params"
import { ArrowDownUp } from "lucide-react"

type OrderType = "newest" | "oldest" | "name_asc" | "name_desc" | "price_asc" | "price_desc" | "stock_asc" | "stock_desc"
const order_labels: Record<OrderType, string> = {
    name_asc: "Nombre A-Z",
    name_desc: "Nombre Z-A",
    newest: "Más recientes",
    oldest: "Más antiguas",
    price_asc: "Precio ↑",
    price_desc: "Precio ↓",
    stock_asc: "Stock ↑",
    stock_desc: "Stock ↓"
}

type SortSelectProps = {
    onSelect?: (order: OrderType) => void
}

export default function SortSelect({ onSelect }: SortSelectProps) {
    const [ order, setOrder] = useOrder({ defaultValue: "name_asc" })
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-11 rounded-2xl bg-background">
                    <ArrowDownUp className="mr-2 h-4 w-4" />
                    {order_labels[order as OrderType]}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="start">
                <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
                <DropdownMenuGroup>
                    {Object.entries(order_labels).map(([value, label]) => (
                        <DropdownMenuItem
                            key={value}
                            className="cursor-pointer"
                            onSelect={() => {
                                setOrder(value as OrderType)
                                onSelect?.(value as OrderType)
                            }}
                        >
                            {label}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}