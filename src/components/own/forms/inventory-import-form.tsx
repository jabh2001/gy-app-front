"use client";

import { Upload, X } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload";

type Props = {
    importInventoryFile: (file: File) => Promise<{ success: boolean; message?: string; created?: number; updated?: number }>
}
export function InventoryUpload({ importInventoryFile }: Props) {
  const [files, setFiles] = React.useState<File[]>([]);
  const [uploading, setUploading] = React.useState(false);

  const onFileReject = React.useCallback((_file: File, _message: string) => {
    // toast(message, {
    //   description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" ha sido rechazado`,
    // });
  }, []);

  const handleUpload = async () => {
    // haz el proceso completo de subida aquí, por ejemplo:
    if (files.length === 0) return;
    setUploading(true);
    importInventoryFile(files[0]).finally(() => {
      setUploading(false);
    //   setFiles([]);
    });
  }

  return (
    <div className="space-y-4 w-full">
      <FileUpload
        maxFiles={1}
        maxSize={5 * 1024 * 1024}
        value={files}
        onValueChange={setFiles}
        onFileReject={onFileReject}
      >
        <FileUploadDropzone>
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="flex items-center justify-center rounded-full border p-2.5">
              <Upload className="size-6 text-muted-foreground" />
            </div>
            <p className="font-medium text-sm">Arrastra y suelta tu archivo aquí</p>
            <p className="text-muted-foreground text-xs">O haz clic para seleccionar (1 archivo, hasta 5MB)</p>
          </div>
          <FileUploadTrigger asChild>
            <Button variant="outline" size="sm" className="mt-2 w-fit">
              Seleccionar archivo
            </Button>
          </FileUploadTrigger>
        </FileUploadDropzone>

        <FileUploadList className="mt-4">
          {files.map((file, index) => (
            <FileUploadItem key={index} value={file}>
              <FileUploadItemPreview />
              <FileUploadItemMetadata />
              <FileUploadItemDelete asChild>
                <Button variant="ghost" size="icon" className="size-7">
                  <X />
                </Button>
              </FileUploadItemDelete>
            </FileUploadItem>
          ))}
        </FileUploadList>
      </FileUpload>

      <Button
        className="mt-2"
        onClick={handleUpload}
        disabled={uploading || files.length === 0}
      >
        {uploading ? "Subiendo..." : "Subir inventario"}
      </Button>
    </div>
  );
}