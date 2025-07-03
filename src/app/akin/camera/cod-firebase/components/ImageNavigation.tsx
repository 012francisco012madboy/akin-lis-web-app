"use client";

import React from 'react';
import Link from 'next/link';
import { AppImage, Exam } from '@/types';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ImageNavigationProps {
  exam: Exam;
  examImages: AppImage[];
  currentImageId: string;
}

export function ImageNavigation({ exam, examImages, currentImageId }: ImageNavigationProps) {
  const router = useRouter();
  const currentIndex = examImages.findIndex(img => img.id === currentImageId);
  
  if (currentIndex === -1) return null;

  const prevImage = currentIndex > 0 ? examImages[currentIndex - 1] : null;
  const nextImage = currentIndex < examImages.length - 1 ? examImages[currentIndex + 1] : null;

  const currentImage = examImages[currentIndex];

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || document.querySelector('[role="dialog"]')) {
            return;
        }

        if (e.key === 'ArrowLeft' && prevImage) {
            router.push(`/annotate/${prevImage.id}`);
        } else if (e.key === 'ArrowRight' && nextImage) {
            router.push(`/annotate/${nextImage.id}`);
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, [prevImage, nextImage, router]);

  return (
    <div className="flex items-center justify-between w-full p-2 px-4 bg-card border-b shadow-sm">
      <div className="flex-1 flex justify-start">
        <Button variant="outline" size="sm" asChild>
            <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar aos Exames
            </Link>
        </Button>
      </div>

      <div className="flex-1 flex items-center justify-center gap-4">
        <Button variant="outline" size="icon" className="h-8 w-8" asChild disabled={!prevImage}>
          <Link href={prevImage ? `/annotate/${prevImage.id}` : '#'} aria-disabled={!prevImage}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Imagem Anterior</span>
          </Link>
        </Button>

        <div className="text-center">
            <p className="text-sm font-semibold truncate max-w-xs" title={currentImage.name}>{currentImage.name}</p>
            <p className="text-xs text-muted-foreground">
                Imagem {currentIndex + 1} de {examImages.length}
            </p>
        </div>
        
        <Button variant="outline" size="icon" className="h-8 w-8" asChild disabled={!nextImage}>
          <Link href={nextImage ? `/annotate/${nextImage.id}` : '#'} aria-disabled={!nextImage}>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Próxima Imagem</span>
          </Link>
        </Button>
      </div>
      <div className="flex-1"></div>
    </div>
  );
}
