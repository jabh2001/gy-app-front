import { useEffect, useRef } from "react";

/**
 * Hook para interceptar el botón atrás (móviles) y la tecla Escape (escritorio).
 * @param onClose Función que se ejecutará al presionar Atrás o Escape.
 * @param isActive Booleano que indica si la detección debe estar activa.
 */
export function useBackAndEscape(onClose: () => void, isActive: boolean = false) {
  const initialHref = useRef<string>("");

  useEffect(() => {
    if (!isActive) return;

    // Guardamos la URL exacta en el momento de abrir
    initialHref.current = window.location.href;
    let closedByPopState = false;

    // 1. Insertamos estado ficticio en el historial
    window.history.pushState({ modalOpen: true }, "", window.location.href);

    const handlePopState = () => {
      // El usuario presionó el botón 'Atrás' del teléfono/navegador
      closedByPopState = true;
      onClose();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Esc") {
        onClose();
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("keydown", handleKeyDown);

      // SOLO hacemos history.back() si:
      // 1. NO se cerró por el botón 'Atrás' físico/virtual (ya que el navegador ya consumió el estado).
      // 2. La URL sigue siendo la misma donde se abrió el modal (evita cancelar redirecciones/navegaciones).
      if (!closedByPopState && window.location.href === initialHref.current) {
        window.history.back();
      }
    };
  }, [isActive, onClose]);
}
/*
import { useEffect } from "react";

export function useBackAndEscape(onClose: () => void, isActive: boolean = false) {
  useEffect(() => {
    // Si el modal está cerrado, no ejecutamos nada y el comportamiento es 100% normal
    if (!isActive) return;

    let pushedDummyState = false;

    // 1. Insertamos estado ficticio en el historial al activarse
    window.history.pushState({ modalOpen: true }, "", window.location.href);
    pushedDummyState = true;

    // --- Manejador del botón Atrás (Android/iOS/Navegador) ---
    const handlePopState = () => {
      // El navegador ya consumió el estado ficticio al presionar atrás
      pushedDummyState = false;
      onClose();
    };

    // --- Manejador de la tecla Escape (Escritorio/Teclado) ---
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Esc") {
        onClose();
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("keydown", handleKeyDown);

    // --- Limpieza al desactivar o desmontar ---
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("keydown", handleKeyDown);

      // Si el modal se cerró por otra vía (ej: botón 'X', clic afuera o tecla Escape),
      // retiramos el estado ficticio del historial para mantener la pila limpia.
      if (pushedDummyState) {
        window.history.back();
      }
    };
  }, [isActive, onClose]);
}
*/