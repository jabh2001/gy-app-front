import { STATIC_DEFAULT_HOSTS } from "@/api";
import React, { useState, useEffect } from "react";



const FALLBACK_IMAGE = "/placeholder.jpg"; // Imagen por defecto si todos fallan

interface MultiHostImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  path?: string;
  hosts?: string[];
  fallbackSrc?: string;
}

export const MultiHostImage: React.FC<MultiHostImageProps> = ({
  path,
  hosts = STATIC_DEFAULT_HOSTS,
  fallbackSrc = FALLBACK_IMAGE,
  alt = "Imagen",
  className,
  ...props
}) => {
  const [currentHostIndex, setCurrentHostIndex] = useState<number>(0);
  const [hasFailedAll, setHasFailedAll] = useState<boolean>(false);

  // Reiniciar estados si cambia el path
  useEffect(() => {
    setCurrentHostIndex(0);
    setHasFailedAll(false);
  }, [path]);

  // Si no se proporciona path, no se renderiza o se muestra directamente el fallback
  if (!path) {
    return <img src={fallbackSrc} alt={alt} className={className} {...props} />;
  }

  // Si ya se probaron todos los hostings sin éxito, usar la imagen predeterminada
  if (hasFailedAll) {
    return <img src={fallbackSrc} alt={alt} className={className} {...props} />;
  }

  // Normalizar la concatenación de la URL
  const currentHost = hosts[currentHostIndex] || "";
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const cleanHost = currentHost.endsWith("/") ? currentHost.slice(0, -1) : currentHost;
  const currentUrl = `${cleanHost}${cleanPath}`;

  const handleError = () => {
    if (currentHostIndex < hosts.length - 1) {
      // Probar con el siguiente hosting de la lista
      setCurrentHostIndex((prev) => prev + 1);
    } else {
      // Ya se agotaron todos los hostings
      setHasFailedAll(true);
    }
  };

  return (
    <img
      src={currentUrl}
      alt={alt}
      onError={handleError}
      className={className}
      {...props}
    />
  );
};