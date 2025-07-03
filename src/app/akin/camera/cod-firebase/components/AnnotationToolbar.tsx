"use client";

import React from 'react';
import { Tool } from '@/types';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MousePointer, Move, ZoomIn, ZoomOut, Frame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';

interface AnnotationToolbarProps {
  activeTool: Tool;
  setActiveTool: (tool: Tool) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitToScreen: () => void;
}

const tools: { name: Tool; icon: React.ElementType; label: string; shortcut: string }[] = [
  { name: 'select', icon: MousePointer, label: 'Selecionar', shortcut: 'V' },
  { name: 'pan', icon: Move, label: 'Mover', shortcut: 'H' },
];

export function AnnotationToolbar({ activeTool, setActiveTool, onZoomIn, onZoomOut, onFitToScreen }: AnnotationToolbarProps) {
  return (
    <div className="h-full bg-background border-l border-border p-2">
      <TooltipProvider delayDuration={100}>
        <div className="flex flex-col items-center gap-2">
          {tools.map((tool) => (
            <Tooltip key={tool.name}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'h-10 w-10',
                    activeTool === tool.name && 'bg-accent text-accent-foreground'
                  )}
                  onClick={() => setActiveTool(tool.name)}
                >
                  <tool.icon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <div className="flex items-center gap-2">
                  <p>{tool.label}</p>
                  <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    {tool.shortcut}
                  </kbd>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
          <Separator className="my-2" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10" onClick={onZoomIn}>
                <ZoomIn className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
                <div className="flex items-center gap-2">
                  <p>Aumentar Zoom</p>
                  <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    +
                  </kbd>
                </div>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10" onClick={onZoomOut}>
                <ZoomOut className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
                <div className="flex items-center gap-2">
                  <p>Diminuir Zoom</p>
                  <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    -
                  </kbd>
                </div>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10" onClick={onFitToScreen}>
                <Frame className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
                <div className="flex items-center gap-2">
                  <p>Ajustar à Tela</p>
                  <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    F
                  </kbd>
                </div>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
}
