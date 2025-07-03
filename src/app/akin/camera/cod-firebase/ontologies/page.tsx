  "use client";

import React, { useState, useContext } from 'react';
import { AppContext } from '@/context/AppContext';
import { Ontology, OntologyObject, GeometryType, Classification } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2, Square, Circle, Dot, Spline, Edit } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const shapeIcons: Record<GeometryType, React.ElementType> = { rect: Square, circle: Circle, point: Dot, polygon: Spline };

function cleanClassifications(classifications: Classification[]): Classification[] {
  return classifications
    .map(c => ({ ...c, name: c.name.trim(), subClassifications: cleanClassifications(c.subClassifications) }))
    .filter(c => c.name !== '');
}

const ClassificationEditor: React.FC<{ classifications: Classification[]; onUpdate: (updated: Classification[]) => void; level?: number; }> = ({ classifications, onUpdate, level = 0 }) => {
  const handleAdd = () => onUpdate([...classifications, { id: `cls-${Date.now()}-${Math.random()}`, name: '', subClassifications: [] }]);
  const handleUpdateName = (id: string, name: string) => onUpdate(classifications.map(c => c.id === id ? { ...c, name } : c));
  const handleRemove = (id: string) => onUpdate(classifications.filter(c => c.id !== id));
  const handleSubUpdate = (id: string, subClassifications: Classification[]) => onUpdate(classifications.map(c => c.id === id ? { ...c, subClassifications } : c));

  return (
    <div className="space-y-3" style={{ marginLeft: level > 0 ? '1rem' : 0, paddingLeft: level > 0 ? '1rem' : 0, borderLeft: level > 0 ? '1px solid hsl(var(--border))' : 'none' }}>
      {classifications.map(c => (
        <div key={c.id}>
          <div className="flex items-center gap-2">
            <Input value={c.name} onChange={e => handleUpdateName(c.id, e.target.value)} placeholder={`Nome da Classificação Nível ${level + 1}`} />
            <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={() => handleRemove(c.id)}><Trash2 className="h-4 w-4" /></Button>
          </div>
          <div className="pt-3">
            <ClassificationEditor classifications={c.subClassifications} onUpdate={subs => handleSubUpdate(c.id, subs)} level={level + 1} />
          </div>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={handleAdd}><PlusCircle className="mr-2 h-4 w-4" /> Adicionar {level > 0 ? 'Sub-classificação' : 'Classificação'}</Button>
    </div>
  );
};

function TemplateEditorDialog({ children, template, onSave }: { children: React.ReactNode, template?: Ontology | null, onSave: (ontology: Omit<Ontology, 'id'>) => void }) {
  const { state } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [objects, setObjects] = useState<OntologyObject[]>([]);
  const { toast } = useToast();

  React.useEffect(() => {
    if (isOpen) {
      setName(template?.name || '');
      setObjects(template?.objects ? JSON.parse(JSON.stringify(template.objects)) : []);
    }
  }, [isOpen, template]);

  const handleSave = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast({ title: "Erro", description: "O nome do template não pode ser vazio.", variant: "destructive" });
      return;
    }
    
    const isNameTaken = state.ontologies.some(o => 
        o.name.trim().toLowerCase() === trimmedName.toLowerCase() && o.id !== template?.id
    );

    if (isNameTaken) {
        toast({ title: "Erro de Validação", description: "Já existe uma ontologia com este nome. Por favor, escolha outro.", variant: "destructive" });
        return;
    }

    onSave({ name: trimmedName, objects, isGlobal: true });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl w-full h-[90vh] flex flex-col">
        <DialogHeader><DialogTitle>{template ? 'Editar Template' : 'Criar Novo Template'}</DialogTitle></DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 overflow-hidden">
          <div className="flex flex-col gap-4">
            <div className="space-y-1">
              <Label htmlFor="template-name">Nome do Template</Label>
              <Input id="template-name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Template de Células Sanguíneas" />
            </div>
            <Card className="flex-1 flex flex-col">
              <CardHeader>
                <CardTitle>Objetos</CardTitle>
                <CardDescription>Defina os objetos para este template.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden">
                <ObjectEditor objects={objects} setObjects={setObjects} />
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-col">
            <Card className="flex-1">
              <CardHeader><CardTitle>Pré-visualização</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Nome: <span className="font-semibold text-foreground">{name || "..."}</span></p>
                <p className="text-sm text-muted-foreground mt-2">Objetos:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-sm">
                  {objects.map(obj => <li key={obj.id} style={{ color: obj.color }}>{obj.name}</li>)}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
          <Button onClick={handleSave}>Salvar Template</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ObjectEditor({ objects, setObjects }: { objects: OntologyObject[], setObjects: (objects: OntologyObject[]) => void }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingObject, setEditingObject] = useState<OntologyObject | null>(null);
  const [objectName, setObjectName] = useState('');
  const [objectShape, setObjectShape] = useState<GeometryType>('rect');
  const [objectColor, setObjectColor] = useState('#A0E7E5');
  const [objectClassifications, setObjectClassifications] = useState<Classification[]>([]);
  const [objectEnableComments, setObjectEnableComments] = useState(false);
  const { toast } = useToast();

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
    const newObject: OntologyObject = {
      id: editingObject?.id || `obj-${Date.now()}`,
      name: objectName.trim(), 
      shape: objectShape, 
      color: objectColor, 
      classifications: finalClassifications,
      enableComments: objectEnableComments,
    };
    if (editingObject) {
      setObjects(objects.map(o => o.id === editingObject.id ? newObject : o));
    } else {
      setObjects([...objects, newObject]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteObject = (id: string) => {
    setObjects(objects.filter(o => o.id !== id));
  };

  return (
    <>
      <Button variant="outline" className="w-full mb-4" onClick={() => openModal()}>
        <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Objeto
      </Button>
      <ScrollArea className="h-[calc(100%-4rem)]">
        <div className="space-y-2 pr-4">
          {objects.map(obj => (
            <div key={obj.id} className="p-3 rounded-md border flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: obj.color }}></div>
                <span className="font-semibold">{obj.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openModal(obj)}><Edit className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDeleteObject(obj.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
           {objects.length === 0 && <p className="text-sm text-muted-foreground text-center pt-8">Nenhum objeto definido.</p>}
        </div>
      </ScrollArea>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editingObject ? 'Editar Objeto' : 'Novo Objeto'}</DialogTitle></DialogHeader>
          <ScrollArea className="max-h-[70vh] -mx-6 px-6">
            <div className="space-y-4 py-4 pr-2">
              <div className="space-y-1"><Label htmlFor="obj-name">Nome do Objeto</Label><Input id="obj-name" placeholder="e.g., Célula" value={objectName} onChange={e => setObjectName(e.target.value)} /></div>
              <div className="space-y-1"><Label htmlFor="obj-shape">Forma Geométrica</Label><Select value={objectShape} onValueChange={(v: GeometryType) => setObjectShape(v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.keys(shapeIcons).map((shape) => { const Icon = shapeIcons[shape as GeometryType]; return (<SelectItem key={shape} value={shape}><div className="flex items-center gap-2"><Icon className="h-4 w-4" /><span className="capitalize">{shape}</span></div></SelectItem>) })}</SelectContent></Select></div>
              <div className="space-y-1"><Label htmlFor="obj-color">Cor</Label><div className="flex items-center gap-2 border rounded-md pr-2"><Input type="color" id="obj-color" value={objectColor} onChange={e => setObjectColor(e.target.value)} className="w-12 h-10 p-1 border-0" /><span className="font-mono text-sm">{objectColor.toUpperCase()}</span></div></div>
              <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <Label htmlFor="obj-comments">Campo de Comentários</Label>
                  <p className="text-[0.8rem] text-muted-foreground">Permitir adicionar texto a cada anotação deste objeto.</p>
                </div>
                <Switch id="obj-comments" checked={objectEnableComments} onCheckedChange={setObjectEnableComments} />
              </div>
              <div className="space-y-2"><Label>Classificações Aninhadas</Label><div className="p-4 border rounded-md bg-background"><ClassificationEditor classifications={objectClassifications} onUpdate={setObjectClassifications} /></div></div>
            </div>
          </ScrollArea>
          <DialogFooter><DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose><Button onClick={handleSaveObject}>Salvar Objeto</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function TemplatesPage() {
  const { state, dispatch } = useContext(AppContext);
  const { toast } = useToast();
  const globalOntologies = state.ontologies.filter(o => o.isGlobal);

  const handleCreate = (ontologyData: Omit<Ontology, 'id'>) => {
    dispatch({ type: 'CREATE_GLOBAL_ONTOLOGY', payload: ontologyData });
    toast({ title: 'Sucesso!', description: `Template "${ontologyData.name}" criado.` });
  };

  const handleUpdate = (ontologyData: Ontology) => {
    dispatch({ type: 'UPDATE_ONTOLOGY', payload: ontologyData });
    toast({ title: 'Sucesso!', description: `Template "${ontologyData.name}" atualizado.` });
  };

  const handleDelete = (ontologyId: string) => {
    dispatch({ type: 'DELETE_GLOBAL_ONTOLOGY', payload: ontologyId });
    toast({ title: 'Template Removido' });
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Gestão de Templates</h1>
        <TemplateEditorDialog onSave={handleCreate}>
          <Button><PlusCircle className="mr-2 h-4 w-4" /> Criar Novo Template</Button>
        </TemplateEditorDialog>
      </div>

      {globalOntologies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {globalOntologies.map(ont => {
            const sourceOntology = ont.sourceOntologyId ? state.ontologies.find(o => o.id === ont.sourceOntologyId) : null;
            return (
              <Card key={ont.id}>
                <CardHeader>
                  <CardTitle>{ont.name}</CardTitle>
                  <CardDescription>
                    {ont.objects.length} objeto(s)
                    {sourceOntology && (
                        <span className="block mt-1">Origem: {sourceOntology.name}</span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-24">
                    <ul className="text-sm space-y-1">
                      {ont.objects.map(obj => (
                        <li key={obj.id} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: obj.color }}></div>
                          {obj.name}
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                </CardContent>
                <div className="flex items-center p-6 pt-0">
                  <TemplateEditorDialog template={ont} onSave={(data) => handleUpdate({ ...data, id: ont.id })}>
                    <Button variant="outline" className="w-full">Editar</Button>
                  </TemplateEditorDialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="ml-2 text-destructive shrink-0"><Trash2 className="h-4 w-4" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Tem a certeza?</AlertDialogTitle>
                        <AlertDialogDescription>Esta ação irá remover permanentemente o template "{ont.name}". Esta ação não pode ser desfeita.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(ont.id)}>Confirmar e Remover</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-card rounded-lg border border-dashed">
          <h2 className="text-xl font-semibold text-foreground">Nenhum Template Encontrado</h2>
          <p className="text-muted-foreground mt-2 mb-4">Comece por criar um novo template global para ser reutilizado nos seus exames.</p>
           <TemplateEditorDialog onSave={handleCreate}>
              <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" /> Criar Template</Button>
           </TemplateEditorDialog>
        </div>
      )}
    </div>
  );
}
