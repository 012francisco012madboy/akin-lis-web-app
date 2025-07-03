"use client";

import React, { useState, useContext, useEffect } from 'react';
import { Ontology, OntologyObject, GeometryType, Exam, Classification } from '@/types';
import { AppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusCircle, Trash2, Square, Circle, Dot, Spline, FolderPlus, Upload, Link as LinkIcon, Edit } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Switch } from './ui/switch';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface OntologySidebarProps {
  exam: Exam;
  activeOntologyObjectId: string | null;
  onSelectObject: (object: OntologyObject) => void;
}

const shapeIcons: Record<GeometryType, React.ElementType> = {
    rect: Square,
    circle: Circle,
    point: Dot,
    polygon: Spline
}

// Helper functions for structural comparison
const areClassificationsStructurallyEqual = (
  classifications1: Classification[],
  classifications2: Classification[]
): boolean => {
  if (classifications1.length !== classifications2.length) return false;

  const sorted1 = [...classifications1].sort((a, b) => a.name.localeCompare(b.name));
  const sorted2 = [...classifications2].sort((a, b) => a.name.localeCompare(b.name));

  for (let i = 0; i < sorted1.length; i++) {
    if (sorted1[i].name !== sorted2[i].name) return false;
    if (
      !areClassificationsStructurallyEqual(
        sorted1[i].subClassifications,
        sorted2[i].subClassifications
      )
    ) {
      return false;
    }
  }

  return true;
};

const areObjectsStructurallyEqual = (obj1: OntologyObject, obj2: OntologyObject): boolean => {
  if (
    obj1.name !== obj2.name ||
    obj1.color !== obj2.color ||
    obj1.shape !== obj2.shape ||
    (obj1.enableComments || false) !== (obj2.enableComments || false)
  ) {
    return false;
  }
  return areClassificationsStructurallyEqual(obj1.classifications, obj2.classifications);
};

const areOntologiesStructurallyEqual = (ont1: Ontology, ont2: Ontology): boolean => {
  if (ont1.objects.length !== ont2.objects.length) return false;

  const sortedObjects1 = [...ont1.objects].sort((a, b) => a.name.localeCompare(b.name));
  const sortedObjects2 = [...ont2.objects].sort((a, b) => a.name.localeCompare(b.name));

  for (let i = 0; i < sortedObjects1.length; i++) {
    if (!areObjectsStructurallyEqual(sortedObjects1[i], sortedObjects2[i])) {
      return false;
    }
  }

  return true;
};

function cleanClassifications(classifications: Classification[]): Classification[] {
  return classifications
    .map(c => ({
      ...c,
      name: c.name.trim(),
      subClassifications: cleanClassifications(c.subClassifications),
    }))
    .filter(c => c.name !== '');
}

const ClassificationEditor: React.FC<{
  classifications: Classification[];
  onUpdate: (updated: Classification[]) => void;
  level?: number;
}> = ({ classifications, onUpdate, level = 0 }) => {
  const handleAdd = () => {
    onUpdate([...classifications, { id: `cls-${Date.now()}-${Math.random()}`, name: '', subClassifications: [] }]);
  };

  const handleUpdateName = (id: string, name: string) => {
    onUpdate(classifications.map(c => c.id === id ? { ...c, name } : c));
  };

  const handleRemove = (id: string) => {
    onUpdate(classifications.filter(c => c.id !== id));
  };

  const handleSubUpdate = (id: string, subClassifications: Classification[]) => {
    onUpdate(classifications.map(c => c.id === id ? { ...c, subClassifications } : c));
  };

  return (
    <div className="space-y-3" style={{ marginLeft: level > 0 ? '1rem' : 0, paddingLeft: level > 0 ? '1rem' : 0, borderLeft: level > 0 ? '1px solid hsl(var(--border))' : 'none' }}>
      {classifications.map(c => (
        <div key={c.id}>
          <div className="flex items-center gap-2">
            <Input value={c.name} onChange={e => handleUpdateName(c.id, e.target.value)} placeholder={`Nome da Classificação Nível ${level + 1}`} />
            <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={() => handleRemove(c.id)}><Trash2 className="h-4 w-4" /></Button>
          </div>
          <div className="pt-3">
            <ClassificationEditor
              classifications={c.subClassifications}
              onUpdate={subs => handleSubUpdate(c.id, subs)}
              level={level + 1}
            />
          </div>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={handleAdd}>
        <PlusCircle className="mr-2 h-4 w-4" /> Adicionar {level > 0 ? 'Sub-classificação' : 'Classificação'}
      </Button>
    </div>
  );
};


const ClassificationList = ({ classifications }: { classifications: Classification[] }) => {
    if (!classifications || classifications.length === 0) return null;
    
    return (
        <div className="mt-2 w-full">
            {classifications.map(c => (
                <div key={c.id} className="w-full relative">
                    <div className="text-xs text-muted-foreground border rounded-full px-2 py-0.5 inline-block my-0.5 bg-background">{c.name}</div>
                    {c.subClassifications && c.subClassifications.length > 0 && (
                        <div className="pl-4 mt-1 border-l ml-2">
                            <ClassificationList classifications={c.subClassifications} />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

function OntologySwitcher({ exam, hasExistingOntology }: { exam: Exam, hasExistingOntology: boolean }) {
    const { state, dispatch } = useContext(AppContext);
    const { toast } = useToast();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newOntologyName, setNewOntologyName] = useState('');
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState<{ onConfirm: () => void } | null>(null);

    const annotationsForExam = state.annotations.filter(ann => {
        const img = state.images.find(i => i.id === ann.imageId);
        return img?.examId === exam.id;
    });
    const hasDataToLose = hasExistingOntology && annotationsForExam.length > 0;

    const localOntologiesForThisExam = state.ontologies.filter(
        ont => ont.creatorExamId === exam.id && !ont.isGlobal
    );

    const existingCopiesStatus = localOntologiesForThisExam.reduce((acc, ont) => {
        if (ont.sourceOntologyId) {
            acc[ont.sourceOntologyId] = ont.isModified || false;
        }
        return acc;
    }, {} as Record<string, boolean>);

    const performCreateNew = () => {
        const trimmedName = newOntologyName.trim();
        if (!trimmedName) {
            toast({ title: 'Erro', description: 'O nome da ontologia não pode ser vazio.', variant: 'destructive' });
            return;
        }

        const isNameTaken = state.ontologies.some(o => o.name.trim().toLowerCase() === trimmedName.toLowerCase());
        if (isNameTaken) {
            toast({ title: "Erro de Validação", description: "Já existe uma ontologia com este nome. Por favor, escolha outro.", variant: "destructive" });
            return;
        }

        dispatch({ type: 'CREATE_LOCAL_ONTOLOGY_FOR_EXAM', payload: { examId: exam.id, name: trimmedName }});
        toast({ title: "Ontologia Criada", description: "Pode agora adicionar objetos à sua nova ontologia."});
        setIsCreateModalOpen(false);
        setNewOntologyName('');
    };

    const performLinkTemplate = (templateId: string) => {
        dispatch({ type: 'COPY_TEMPLATE_TO_EXAM', payload: { examId: exam.id, templateId: templateId } });
        toast({ title: "Template Aplicado", description: `Uma cópia do template foi criada para este exame.`});
        setIsLinkModalOpen(false);
    };

    const performSetLocalOntology = (ontologyId: string) => {
        dispatch({ type: 'SET_ACTIVE_ONTOLOGY', payload: { examId: exam.id, ontologyId: ontologyId }});
        toast({ title: "Ontologia Alterada", description: `A ontologia foi alterada.`});
        setIsLinkModalOpen(false);
    };
    
    const handleActionWithConfirmation = (action: () => void) => {
        if (hasDataToLose) {
            setPendingAction({ onConfirm: action });
        } else {
            action();
        }
    }
    
    const availableOntologies = state.ontologies.filter(ont => {
        const isGlobal = ont.isGlobal;
        const isOwnLocal = ont.creatorExamId === exam.id;
        const isActive = ont.id === exam.ontologyId;
        return (isGlobal || isOwnLocal) && !isActive;
    });
    
    const confirmationDialog = (
        <AlertDialog open={!!pendingAction} onOpenChange={(open) => !open && setPendingAction(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Tem a certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta ação irá substituir a ontologia atual e eliminar permanentemente as {annotationsForExam.length} anotações existentes para este exame. Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setPendingAction(null)}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => {
                        pendingAction?.onConfirm();
                        setPendingAction(null);
                    }}>Confirmar e Continuar</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
    
    return (
        <div className="space-y-2 p-2 pt-0">
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                    <Button className="w-full" variant={hasExistingOntology ? "secondary" : "default"} onClick={() => setNewOntologyName(`Ontologia para ${exam.name}`)}>
                        <FolderPlus className="mr-2 h-4 w-4" /> Criar Nova Ontologia Local
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Criar Nova Ontologia Local</DialogTitle>
                        <DialogDescription>Dê um nome para a ontologia deste exame.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-2">
                        <Label htmlFor="ontology-name">Nome da Ontologia</Label>
                        <Input id="ontology-name" value={newOntologyName} onChange={(e) => setNewOntologyName(e.target.value)} placeholder={`e.g. Ontologia para ${exam.name}`} />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
                        <Button onClick={() => handleActionWithConfirmation(performCreateNew)}>Criar e Usar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isLinkModalOpen} onOpenChange={setIsLinkModalOpen}>
                <DialogTrigger asChild>
                    <Button variant="secondary" className="w-full" disabled={availableOntologies.length === 0}>
                        <LinkIcon className="mr-2 h-4 w-4" /> Utilizar Ontologia Existente
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader><DialogTitle>Utilizar uma Ontologia Existente</DialogTitle></DialogHeader>
                    <ScrollArea className="max-h-80 my-4 -mx-6 px-6">
                        <div className="space-y-2">
                            {availableOntologies.length > 0 ? availableOntologies.map(ont => {
                                const isGlobalTemplate = ont.isGlobal;
                                const hasUnmodifiedCopy = isGlobalTemplate && existingCopiesStatus[ont.id] === false;

                                const sourceExamName = ont.isGlobal ? "Template Global" : state.exams.find(ex => ex.id === ont.creatorExamId)?.name;
                                
                                return (
                                  <div key={ont.id} className={cn("p-3 border rounded-md flex justify-between items-center group",
                                     hasUnmodifiedCopy ? "bg-muted/50 cursor-not-allowed opacity-70" : "cursor-pointer hover:bg-accent"
                                  )}>
                                    <div 
                                      className="flex-1 pr-2" 
                                      onClick={!hasUnmodifiedCopy ? () => handleActionWithConfirmation(() => {
                                          if (ont.isGlobal) performLinkTemplate(ont.id);
                                          else performSetLocalOntology(ont.id);
                                      }) : undefined}
                                    >
                                        <p className="font-semibold">{ont.name}</p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {ont.objects.length} objetos. Origem: {sourceExamName || 'Desconhecida'}
                                        </p>
                                        {hasUnmodifiedCopy && (
                                            <p className="text-xs text-amber-600 mt-1 font-medium">
                                                Já existe uma cópia por editar. Edite-a para poder criar uma nova.
                                            </p>
                                        )}
                                    </div>
                                    {!ont.isGlobal && (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive shrink-0 opacity-0 group-hover:opacity-100" onClick={(e) => e.stopPropagation()}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Tem a certeza?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Esta ação irá remover permanentemente a ontologia local "{ont.name}". Esta ação não pode ser desfeita.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => {
                                                        dispatch({ type: 'DELETE_LOCAL_ONTOLOGY_FROM_EXAM', payload: { ontologyId: ont.id } });
                                                        toast({ title: 'Ontologia Removida' });
                                                    }}>Confirmar e Remover</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    )}
                                  </div>
                                )
                            }) : <p className="text-sm text-muted-foreground text-center">Nenhuma outra ontologia disponível.</p>}
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
            {confirmationDialog}
        </div>
    );
}


function OntologyManager({ exam, activeOntologyObjectId, onSelectObject }: OntologySidebarProps) {
  const { state, dispatch } = useContext(AppContext);
  const { toast } = useToast();
  const ontology = state.ontologies.find(o => o.id === exam.ontologyId) as Ontology;
  const globalTemplates = state.ontologies.filter(ont => ont.isGlobal);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingObject, setEditingObject] = useState<OntologyObject | null>(null);

  // Form state for the modal
  const [objectName, setObjectName] = useState('');
  const [objectShape, setObjectShape] = useState<GeometryType>('rect');
  const [objectColor, setObjectColor] = useState('#A0E7E5');
  const [objectClassifications, setObjectClassifications] = useState<Classification[]>([]);
  const [objectEnableComments, setObjectEnableComments] = useState(false);
  
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  
  const [localOntologyName, setLocalOntologyName] = useState(ontology.name);

  useEffect(() => {
    setLocalOntologyName(ontology.name);
  }, [ontology.name]);

  const handleNameBlur = () => {
    const trimmedName = localOntologyName.trim();
    if (!trimmedName) {
        toast({ title: "Erro", description: "O nome da ontologia não pode ser vazio.", variant: "destructive" });
        setLocalOntologyName(ontology.name); // Revert
        return;
    }

    const isNameTaken = state.ontologies.some(o => 
        o.name.trim().toLowerCase() === trimmedName.toLowerCase() && o.id !== ontology.id
    );

    if (isNameTaken) {
        toast({ title: "Nome Inválido", description: "Já existe outra ontologia com este nome.", variant: "destructive" });
        setLocalOntologyName(ontology.name); // Revert
        return;
    }
    
    if (trimmedName !== ontology.name) {
        const updatedOntology = { ...ontology, name: trimmedName, isModified: true };
        dispatch({ type: "UPDATE_ONTOLOGY", payload: updatedOntology });
    }
  };

  const openModal = (obj: OntologyObject | null = null) => {
    setEditingObject(obj);
    setObjectName(obj?.name || '');
    setObjectShape(obj?.shape || 'rect');
    setObjectColor(obj?.color || '#A0E7E5');
    setObjectClassifications(obj ? JSON.parse(JSON.stringify(obj.classifications)) : []);
    setObjectEnableComments(obj?.enableComments || false);
    setIsModalOpen(true);
  };

  const handleSaveObject = () => {
    if (!objectName.trim()) {
        toast({ title: "Erro", description: "O nome do objeto não pode ser vazio.", variant: "destructive" });
        return;
    }
    
    const finalClassifications = cleanClassifications(objectClassifications);

    let updatedObjects;
    if (editingObject) {
      // Update existing object
      const updatedObject: OntologyObject = {
        ...editingObject,
        name: objectName.trim(),
        shape: objectShape,
        color: objectColor,
        classifications: finalClassifications,
        enableComments: objectEnableComments,
      };
      updatedObjects = ontology.objects.map(o => o.id === editingObject.id ? updatedObject : o);
      toast({ title: "Sucesso", description: `Objeto "${updatedObject.name}" atualizado.`});
    } else {
      // Add new object
      const newObject: OntologyObject = {
          id: `obj-${Date.now()}`,
          name: objectName.trim(),
          shape: objectShape,
          color: objectColor,
          classifications: finalClassifications,
          enableComments: objectEnableComments,
      }
      updatedObjects = [...ontology.objects, newObject];
      toast({ title: "Sucesso", description: `Objeto "${newObject.name}" adicionado.`});
    }

    const updatedOntology = { ...ontology, objects: updatedObjects, isModified: true };
    dispatch({ type: "UPDATE_ONTOLOGY", payload: updatedOntology });

    setIsModalOpen(false);
    setEditingObject(null);
  };

  const handleDeleteObject = (objectId: string) => {
    const updatedOntology = { ...ontology, objects: ontology.objects.filter(obj => obj.id !== objectId), isModified: true }
    dispatch({ type: "UPDATE_ONTOLOGY", payload: updatedOntology });
    toast({ title: "Objeto removido", description: "O objeto foi removido da ontologia."});
  }

  const identicalTemplateExists = React.useMemo(() => {
    if (ontology.isGlobal) return false;
    return globalTemplates.some(globalOnt => 
        areOntologiesStructurallyEqual(ontology, globalOnt)
    );
  }, [ontology, globalTemplates]);

  const nameCollisionExists = React.useMemo(() => {
    return globalTemplates.some(globalOnt => 
        globalOnt.name.trim().toLowerCase() === ontology.name.trim().toLowerCase()
    );
  }, [ontology.name, globalTemplates]);
  
  const handleDeleteLocalOntology = () => {
    dispatch({ type: 'DELETE_LOCAL_ONTOLOGY_FROM_EXAM', payload: { ontologyId: ontology.id } });
    toast({ title: "Ontologia Removida", description: "A ontologia local e as suas anotações foram removidas deste exame." });
    setIsDeleteConfirmOpen(false);
  }

  const handlePromote = () => {
    dispatch({ type: 'PROMOTE_TO_TEMPLATE', payload: { sourceOntologyId: ontology.id } });
    toast({
      title: "Promovido a Template!",
      description: `Uma cópia de "${ontology.name}" está agora disponível como um template global.`
    });
  }
  
  let promoteTooltipContent = "Promover a um template global.";
  if (identicalTemplateExists) {
      promoteTooltipContent = "Já existe um template global com esta estrutura.";
  } else if (nameCollisionExists) {
      promoteTooltipContent = "Já existe um template global com este nome. Por favor, renomeie a ontologia local antes de promover.";
  }
  
  return (
    <>
      <CardHeader>
        <CardTitle>Ontologia do Exame</CardTitle>
        <Input 
          value={localOntologyName}
          onChange={(e) => setLocalOntologyName(e.target.value)}
          onBlur={handleNameBlur}
          className="text-sm text-muted-foreground border-0 focus-visible:ring-1 focus-visible:ring-ring p-0 h-auto mt-1"
        />
      </CardHeader>
      <Separator />
      <CardContent className='p-2 space-y-2'>
          <Button variant="outline" className="w-full" onClick={() => openModal(null)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Objeto
          </Button>
          <Dialog open={isModalOpen} onOpenChange={(isOpen) => { setIsModalOpen(isOpen); if (!isOpen) setEditingObject(null); }}>
              <DialogContent className="max-w-lg">
                  <DialogHeader><DialogTitle>{editingObject ? 'Editar Objeto' : 'Novo Objeto'}</DialogTitle></DialogHeader>
                  <ScrollArea className="max-h-[70vh] -mx-6 px-6">
                    <div className="space-y-4 py-4 pr-2">
                        <div className="space-y-1">
                            <Label htmlFor="obj-name">Nome do Objeto</Label>
                            <Input id="obj-name" placeholder="e.g., Célula" value={objectName} onChange={e => setObjectName(e.target.value)} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="obj-shape">Forma Geométrica</Label>
                            <Select value={objectShape} onValueChange={(v: GeometryType) => setObjectShape(v)}>
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    {Object.keys(shapeIcons).map((shape) => {
                                        const Icon = shapeIcons[shape as GeometryType];
                                        return (
                                            <SelectItem key={shape} value={shape}>
                                                <div className="flex items-center gap-2"><Icon className="h-4 w-4" /><span className="capitalize">{shape}</span></div>
                                            </SelectItem>
                                        )
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="obj-color">Cor</Label>
                            <div className="flex items-center gap-2 border rounded-md pr-2"><Input type="color" id="obj-color" value={objectColor} onChange={e => setObjectColor(e.target.value)} className="w-12 h-10 p-1 border-0"/><span className="font-mono text-sm">{objectColor.toUpperCase()}</span></div>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <Label htmlFor="obj-comments">Campo de Comentários</Label>
                                <p className="text-[0.8rem] text-muted-foreground">Permitir adicionar texto a cada anotação deste objeto.</p>
                            </div>
                            <Switch id="obj-comments" checked={objectEnableComments} onCheckedChange={setObjectEnableComments} />
                        </div>
                        <div className="space-y-2">
                            <Label>Classificações Aninhadas</Label>
                             <DialogDescription>Crie uma hierarquia de classificações para este objeto.</DialogDescription>
                            <div className="p-4 border rounded-md bg-background">
                              <ClassificationEditor classifications={objectClassifications} onUpdate={setObjectClassifications} />
                            </div>
                        </div>
                    </div>
                  </ScrollArea>
                  <DialogFooter><DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose><Button onClick={handleSaveObject}>Salvar Objeto</Button></DialogFooter>
              </DialogContent>
          </Dialog>
      </CardContent>
      <ScrollArea className="flex-1">
        <CardContent className="space-y-2 p-2 pt-0">
          {ontology.objects.length > 0 ? (
            ontology.objects.map((obj) => {
              const Icon = shapeIcons[obj.shape];
              return (
                  <div key={obj.id} onClick={() => onSelectObject(obj)} className={cn('p-3 rounded-md border cursor-pointer transition-all', activeOntologyObjectId === obj.id ? 'bg-primary/20 border-primary shadow-md' : 'hover:bg-accent/50')}>
                      <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3"><Icon className="h-5 w-5" style={{ color: obj.color }} /><span className="font-semibold">{obj.name}</span></div>
                          <div className="flex items-center">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); openModal(obj); }}><Edit className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={(e) => { e.stopPropagation(); handleDeleteObject(obj.id); }}><Trash2 className="h-4 w-4" /></Button>
                          </div>
                      </div>
                       {obj.classifications.length > 0 && (<ClassificationList classifications={obj.classifications} />)}
                  </div>
              )
            })
          ) : (<p className="text-sm text-muted-foreground text-center pt-8 px-4">Nenhum objeto definido. Adicione um para começar a anotar.</p>)}
        </CardContent>
      </ScrollArea>
      <div className="p-2 mt-auto border-t border-border">
          <Accordion type="multiple" className="w-full space-y-1">
              <AccordionItem value="options" className="border bg-background rounded-md !border-border">
                  <AccordionTrigger className="p-2 text-xs font-semibold hover:no-underline">
                      Opções da Ontologia Atual
                  </AccordionTrigger>
                  <AccordionContent className="p-2 pt-0 space-y-2">
                      <TooltipProvider>
                          <Tooltip>
                              <TooltipTrigger asChild>
                                  <div className="w-full">
                                      <Button
                                          variant="outline"
                                          size="sm"
                                          className="w-full mt-2"
                                          onClick={handlePromote}
                                          disabled={identicalTemplateExists || nameCollisionExists}
                                      >
                                          <Upload className="mr-2 h-4 w-4"/> Promover a Template
                                      </Button>
                                  </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                  <p>{promoteTooltipContent}</p>
                              </TooltipContent>
                          </Tooltip>
                      </TooltipProvider>
                      <Separator/>
                      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm" className="w-full">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remover Ontologia do Exame
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Tem a certeza?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação irá remover permanentemente a ontologia "{ontology.name}" deste exame e todas as suas anotações associadas. Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteLocalOntology}>
                              Confirmar e Remover
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                  </AccordionContent>
              </AccordionItem>
              <AccordionItem value="switch" className="border bg-background rounded-md !border-border">
                  <AccordionTrigger className="p-2 text-xs font-semibold hover:no-underline">
                      Mudar Ontologia
                  </AccordionTrigger>
                  <AccordionContent className="p-2 pt-0">
                      <OntologySwitcher exam={exam} hasExistingOntology={true} />
                  </AccordionContent>
              </AccordionItem>
          </Accordion>
      </div>
    </>
  );
}

function OntologySetup({ exam }: { exam: Exam }) {
    return (
        <>
            <CardHeader>
                <CardTitle>Configurar Ontologia do Exame</CardTitle>
                <CardDescription>Escolha uma opção para o exame "{exam.name}".</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="p-2 pt-2">
                <OntologySwitcher exam={exam} hasExistingOntology={false} />
            </CardContent>
        </>
    );
}

export function OntologySidebar(props: OntologySidebarProps) {
  const { state } = useContext(AppContext);
  const ontology = props.exam.ontologyId ? state.ontologies.find(o => o.id === props.exam.ontologyId) : null;
  
  return (
    <div className="w-80 bg-background border-r border-border flex flex-col h-full">
        {ontology ? <OntologyManager {...props} /> : <OntologySetup exam={props.exam} />}
    </div>
  );
}
