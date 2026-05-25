import {
    Boxes,
    DollarSign,
    Star,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import type { Product } from "@/api/models"

type Props = {
    product: Product
}
export default function ProductCard({ product }: Props) {
    const navigate = useNavigate()
    return (
        <Card
            className="group overflow-hidden rounded border-border/70 bg-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
        >
            <div className="flex gap-4 p-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center  border border-border/60 bg-muted/60 text-muted-foreground shadow-inner">
                    <img src={product.main_image_url_path!} alt={product.name} className="h-full w-full object-cover" />
                </div>

                <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <h2 className="truncate text-base font-semibold leading-tight text-foreground">
                                {product.name}
                            </h2>
                            <p className="mt-1 truncate text-sm text-muted-foreground">
                                [{product.sku}]
                            </p>
                        </div>

                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0 rounded-full text-muted-foreground hover:text-primary"
                            aria-label={`Marcar ${product.name} como favorito`}
                        >
                            <Star className={product.is_featured ? "h-4 w-4 fill-amber-500 text-amber-500" : "h-4 w-4"} />
                        </Button>
                    </div>

                    {product.description ? (
                        <p className="line-clamp-2 text-sm leading-5 text-muted-foreground">
                            {product.description}
                        </p>
                    ) : null}

                    <div className="flex flex-wrap gap-2 pt-1">
                        <span className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-background px-2.5 py-1 text-xs font-medium text-foreground">
                            <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                            {formatPrice(product.price)}
                        </span>

                        <span
                            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${getStockTone(product.stock)}`}
                        >
                            <Boxes className="h-3.5 w-3.5" />
                            {product.stock} en stock
                        </span>
                    </div>

                    {product.badge ? (
                        <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                            {product.badge}
                        </span>
                    ) : null}
                </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-border/60 bg-muted/20 px-4 py-3">
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-xl"
                    onClick={() => navigate(`edit/${product.id}`)}
                >
                    Editar
                </Button>
                <Button
                    variant="secondary"
                    size="sm"
                    className="h-8 rounded-xl"
                    onClick={() => navigate(`detail/${product.id}`)}
                >
                    Ver detalle
                </Button>
            </div>
        </Card>
    )
}

const formatPrice = (value: number | string) => {
    const amount = Number(value)

    if (!Number.isFinite(amount)) {
        return `$${value}`
    }

    return new Intl.NumberFormat("es-DO", {
        style: "currency",
        currency: "USD",
    }).format(amount)
}

const getStockTone = (stock: number | string) => {
    const value = Number(stock)

    if (value <= 0) {
        return "border-red-200 bg-red-50 text-red-700"
    }

    if (value <= 5) {
        return "border-amber-200 bg-amber-50 text-amber-700"
    }

    return "border-emerald-200 bg-emerald-50 text-emerald-700"
}