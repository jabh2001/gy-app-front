function getExtensionFromType(type: string): string {
  switch (type) {
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/gif":
      return ".gif";
    case "image/jpeg":
    case "image/jpg":
    default:
      return ".jpg";
  }
}

function getTypeFromExtension(name: string): string {
  const extension = name.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "gif":
      return "image/gif";
    case "jpg":
    case "jpeg":
    default:
      return "image/jpeg";
  }
}

function updateFileName(name: string, type: string): string {
  const baseName = name.includes(".") ? name.slice(0, name.lastIndexOf(".")) : name;
  return `${baseName}${getExtensionFromType(type)}`;
}

export function compressImage(file: File, maxWidth = 1200, quality = 0.85): Promise<File> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      resolve(file);
      return;
    }

    const outputType = getTypeFromExtension(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }

        // Rellenar de blanco para formatos sin transparencia
        if (outputType === "image/jpeg") {
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, width, height);
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            const compressedFile = new File([blob], updateFileName(file.name, outputType), {
              type: outputType,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          outputType,
          quality
        );
      };
      img.onerror = () => resolve(file);
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error("Error reading file"));
    reader.readAsDataURL(file);
  });
}
