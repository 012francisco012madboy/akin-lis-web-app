"use client";

import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { AppImage } from '@/types';
import { ScrollArea } from './ui/scroll-area';

interface UploadImageDialogProps {
  children: React.ReactNode;
  examId: string;
}

export function UploadImageDialog({ children, examId }: UploadImageDialogProps) {
  const { dispatch } = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      setFiles(selectedFiles);
      const newPreviewUrls = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(newPreviewUrls);
    }
  };

  useEffect(() => {
    // Cleanup object URLs on unmount or when dialog closes
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleUpload = () => {
    if (files.length === 0) {
      toast({
        title: 'Erro',
        description: 'Por favor, selecione pelo menos uma imagem.',
        variant: 'destructive',
      });
      return;
    }

    const newImages: AppImage[] = files.map(file => ({
      id: `img-${Date.now()}-${Math.random()}`,
      name: file.name,
      url: URL.createObjectURL(file), // This should be handled more robustly in a real app
      dateUploaded: new Date().toISOString(),
      examId: examId,
    }));
    
    // We must revoke the created object URLs for the previews
    // because we are creating new ones for the actual state.
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    const finalImages = newImages.map(img => ({
      ...img,
      url: URL.createObjectURL(files.find(f => f.name === img.name)!)
    }));

    dispatch({ type: 'ADD_IMAGES', payload: { images: finalImages } });

    toast({
      title: 'Sucesso!',
      description: `${files.length} imagem(ns) enviada(s) com sucesso.`,
    });

    // Reset state and close dialog
    setFiles([]);
    setPreviewUrls([]);
    setOpen(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      // Reset state when closing dialog
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      setFiles([]);
      setPreviewUrls([]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enviar Novas Imagens</DialogTitle>
          <DialogDescription>
            Selecione uma ou mais imagens microscópicas.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="picture">Imagens</Label>
            <Input id="picture" type="file" accept="image/*" onChange={handleFileChange} multiple />
          </div>
          {previewUrls.length > 0 && (
            <ScrollArea className="h-64 w-full rounded-md border p-2">
                <div className="grid grid-cols-3 gap-2">
                {previewUrls.map((url, index) => (
                    <div key={url} className="relative aspect-square rounded-md overflow-hidden">
                        <Image src={url} alt={`Visualização ${index + 1}`} fill className="object-cover" />
                    </div>
                ))}
                </div>
            </ScrollArea>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleUpload} disabled={files.length === 0}>
            Enviar e Continuar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
