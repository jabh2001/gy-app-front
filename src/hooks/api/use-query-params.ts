import { parseAsInteger, parseAsStringLiteral, useQueryState } from 'nuqs'

export function useQ() {
  return useQueryState("q", { defaultValue: "" })
}
export function usePage() { 
  return useQueryState("page", parseAsInteger.withDefault(1))
}

export function useOrder({ defaultValue = "name_asc" } :{ defaultValue?: string }={}) {
  return useQueryState("order", { defaultValue })
}

const booleanState = ['true', 'false', "all"] as const;
export function useActive(defaultValue: "true" | "false" | "all" = "all") {
  return useQueryState("active", parseAsStringLiteral(booleanState).withDefault(defaultValue))
}

export function useFeatured(defaultValue: "true" | "false" | "all" = "all") {
  return useQueryState("featured", parseAsStringLiteral(booleanState).withDefault(defaultValue))
}

export function useOnSale(defaultValue: "true" | "false" | "all" = "all") {
  return useQueryState("on_sale", parseAsStringLiteral(booleanState).withDefault(defaultValue))
}

const parentState = ['none', "all"] as const;
export function useParent(defaultValue: "none" | "all" = "all") {
  return useQueryState("parent", parseAsStringLiteral(parentState).withDefault(defaultValue))
}