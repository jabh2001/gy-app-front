// quiero que crees un hook que guarde en estado global de zustand el título de la página, y que lo actualice cada vez que se llame al hook, además de restaurar el título anterior cuando el componente que lo llama se desmonte.

import { useEffect } from "react"
import {create} from "zustand"

type TitleState = {
  title: string
  setTitle: (title: string) => void
}
export const useTitleStore = create<TitleState>()((set) => ({
  title: "Aplicacion de gestión de inventario",
  setTitle: (title: string) => set({ title })
}))


export default function useTitle(title: string) {
  const { setTitle } = useTitleStore()

  useEffect(() => {
    setTitle(title)
    return () => {
        setTitle("Aplicacion de gestión de inventario")
    }
  }, [title])

  return useTitleStore((state) => state.title)
}