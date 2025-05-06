
import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, CardDescription, 
  CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Category, Measure, Resource, LegalDocument } from '@/types/managementTypes';
import { useCategories } from '@/hooks/useCategories';
import { useResources } from '@/hooks/useResources';
import { useLegalDocuments } from '@/hooks/useLegalDocuments';
import { X, Plus } from 'lucide-react';

interface MeasureFormProps {
  initialData?: Partial<Measure> & { 
    resources?: { resource_id: number, quantity: number }[],
    legal_docs?: { document_id: number }[] 
  };
  onSubmit: (
    measure: Omit<Measure, 'id'>, 
    resources: { resource_id: number, quantity: number }[],
    legalDocs: { document_id: number }[]
  ) => Promise<void>;
  onCancel: () => void;
}

export function MeasureForm({ 
  initialData, 
  onSubmit, 
  onCancel 
}: MeasureFormProps) {
  // Отримуємо дані для селекторів
  const { categories } = useCategories();
  const { resources } = useResources();
  const { documents } = useLegalDocuments();
  
  // Стан форми
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [categoryId, setCategoryId] = useState<string>(initialData?.category_id?.toString() || '');
  const [effectiveness, setEffectiveness] = useState<number>(initialData?.effectiveness || 50);
  const [estimatedTime, setEstimatedTime] = useState(initialData?.estimated_time?.toString() || '');
  const [cost, setCost] = useState(initialData?.cost?.toString() || '0');

  // Ресурси для заходу
  const [selectedResources, setSelectedResources] = useState<{
    resource_id: number;
    quantity: number;
    name?: string;
    price?: number;
  }[]>(initialData?.resources?.map(r => ({
    resource_id: r.resource_id as number,
    quantity: r.quantity
  })) || []);

  // Документи для заходу
  const [selectedDocs, setSelectedDocs] = useState<{
    document_id: number;
    name?: string;
  }[]>(initialData?.legal_docs?.map(d => ({
    document_id: d.document_id as number
  })) || []);

  // Вибрані ресурси і документи
  const [resourceId, setResourceId] = useState<string>('');
  const [resourceQuantity, setResourceQuantity] = useState<string>('1');
  const [documentId, setDocumentId] = useState<string>('');

  // Автоматично розраховуємо вартість на основі вибраних ресурсів
  useEffect(() => {
    if (selectedResources.length > 0) {
      const resourcesCost = selectedResources.reduce((acc, res) => {
        const resource = resources.find(r => r.id === res.resource_id);
        if (resource) {
          return acc + (resource.price_per_unit * res.quantity);
        }
        return acc;
      }, 0);
      
      setCost(resourcesCost.toString());
    }
  }, [selectedResources, resources]);

  // Додавання ресурсу до списку
  const addResource = () => {
    if (!resourceId || !resourceQuantity) return;
    
    const id = parseInt(resourceId, 10);
    const quantity = parseFloat(resourceQuantity);
    
    if (isNaN(id) || isNaN(quantity) || quantity <= 0) return;
    
    // Перевіряємо, чи вже є такий ресурс у списку
    if (selectedResources.some(r => r.resource_id === id)) {
      // Оновлюємо кількість, якщо ресурс вже є
      setSelectedResources(prev => 
        prev.map(r => r.resource_id === id ? { ...r, quantity } : r)
      );
    } else {
      // Додаємо новий ресурс
      const resource = resources.find(r => r.id === id);
      setSelectedResources(prev => [
        ...prev, 
        { 
          resource_id: id, 
          quantity,
          name: resource?.name,
          price: resource?.price_per_unit
        }
      ]);
    }
    
    // Очищаємо поля форми
    setResourceId('');
    setResourceQuantity('1');
  };

  // Видалення ресурсу зі списку
  const removeResource = (id: number) => {
    setSelectedResources(prev => prev.filter(r => r.resource_id !== id));
  };

  // Додавання документу до списку
  const addDocument = () => {
    if (!documentId) return;
    
    const id = parseInt(documentId, 10);
    
    if (isNaN(id)) return;
    
    // Перевіряємо, чи вже є такий документ у списку
    if (selectedDocs.some(d => d.document_id === id)) {
      return; // Документ вже є у списку
    }
    
    // Додаємо новий документ
    const doc = documents.find(d => d.id === id);
    setSelectedDocs(prev => [
      ...prev, 
      { 
        document_id: id,
        name: doc?.name
      }
    ]);
    
    // Очищаємо поле форми
    setDocumentId('');
  };

  // Видалення документу зі списку
  const removeDocument = (id: number) => {
    setSelectedDocs(prev => prev.filter(d => d.document_id !== id));
  };

  // Обробка відправки форми
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const measureData: Omit<Measure, 'id'> = {
      name,
      description,
      category_id: categoryId ? parseInt(categoryId, 10) : null,
      effectiveness,
      estimated_time: estimatedTime ? parseInt(estimatedTime, 10) : null,
      cost: parseFloat(cost) || 0
    };
    
    const resourcesData = selectedResources.map(r => ({
      resource_id: r.resource_id,
      quantity: r.quantity
    }));
    
    const docsData = selectedDocs.map(d => ({
      document_id: d.document_id
    }));
    
    await onSubmit(measureData, resourcesData, docsData);
  };

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{initialData ? 'Редагувати захід' : 'Додати новий захід'}</CardTitle>
          <CardDescription>
            {initialData 
              ? 'Відредагуйте інформацію про захід' 
              : 'Заповніть форму для додавання нового заходу'
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Основна інформація */}
          <div className="space-y-4">
            <div className="grid gap-4">
              <div>
                <label htmlFor="name" className="text-sm font-medium mb-1 block">
                  Назва заходу *
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Введіть назву заходу"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="text-sm font-medium mb-1 block">
                  Опис заходу
                </label>
                <Textarea
                  id="description"
                  value={description || ''}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Введіть опис заходу"
                  rows={4}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="text-sm font-medium mb-1 block">
                  Категорія
                </label>
                <Select 
                  value={categoryId} 
                  onValueChange={setCategoryId}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Виберіть категорію" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="estimated-time" className="text-sm font-medium mb-1 block">
                  Оціночний час (днів)
                </label>
                <Input
                  id="estimated-time"
                  type="number"
                  min="1"
                  value={estimatedTime}
                  onChange={(e) => setEstimatedTime(e.target.value)}
                  placeholder="Кількість днів"
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="effectiveness" className="text-sm font-medium">
                  Ефективність
                </label>
                <span className="text-sm">{effectiveness}%</span>
              </div>
              <Slider
                id="effectiveness"
                defaultValue={[effectiveness]}
                onValueChange={(values) => setEffectiveness(values[0])}
                max={100}
                step={1}
                className="my-4"
              />
            </div>
          </div>
          
          {/* Ресурси */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="text-lg font-medium">Необхідні ресурси</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label htmlFor="resource" className="text-sm font-medium mb-1 block">
                  Ресурс
                </label>
                <Select 
                  value={resourceId} 
                  onValueChange={setResourceId}
                >
                  <SelectTrigger id="resource">
                    <SelectValue placeholder="Виберіть ресурс" />
                  </SelectTrigger>
                  <SelectContent>
                    {resources.map((resource) => (
                      <SelectItem key={resource.id} value={resource.id.toString()}>
                        {resource.name} ({resource.unit})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="quantity" className="text-sm font-medium mb-1 block">
                  Кількість
                </label>
                <Input
                  id="quantity"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={resourceQuantity}
                  onChange={(e) => setResourceQuantity(e.target.value)}
                  placeholder="Кількість"
                />
              </div>
              
              <div>
                <Button 
                  type="button" 
                  onClick={addResource}
                  disabled={!resourceId || !resourceQuantity}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" /> Додати ресурс
                </Button>
              </div>
            </div>
            
            {/* Список вибраних ресурсів */}
            {selectedResources.length > 0 && (
              <div className="space-y-2 mt-4">
                <h4 className="text-sm font-medium">Вибрані ресурси:</h4>
                <ul className="space-y-2">
                  {selectedResources.map((res) => {
                    const resource = resources.find(r => r.id === res.resource_id);
                    return (
                      <li 
                        key={res.resource_id} 
                        className="flex justify-between items-center p-2 bg-muted rounded-md"
                      >
                        <span>
                          {resource?.name || res.name || `Ресурс ID:${res.resource_id}`} - {res.quantity} {resource?.unit || 'од.'}
                        </span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeResource(res.resource_id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            
            {/* Загальна вартість */}
            <div>
              <label htmlFor="cost" className="text-sm font-medium mb-1 block">
                Загальна вартість (грн)
              </label>
              <Input
                id="cost"
                type="number"
                min="0"
                step="0.01"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="Вартість"
              />
            </div>
          </div>
          
          {/* Законодавчі документи */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="text-lg font-medium">Законодавчі документи</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div>
                <label htmlFor="document" className="text-sm font-medium mb-1 block">
                  Документ
                </label>
                <Select 
                  value={documentId} 
                  onValueChange={setDocumentId}
                >
                  <SelectTrigger id="document">
                    <SelectValue placeholder="Виберіть документ" />
                  </SelectTrigger>
                  <SelectContent>
                    {documents.map((doc) => (
                      <SelectItem key={doc.id} value={doc.id.toString()}>
                        {doc.name} ({doc.number})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Button 
                  type="button" 
                  onClick={addDocument}
                  disabled={!documentId}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" /> Додати документ
                </Button>
              </div>
            </div>
            
            {/* Список вибраних документів */}
            {selectedDocs.length > 0 && (
              <div className="space-y-2 mt-4">
                <h4 className="text-sm font-medium">Вибрані документи:</h4>
                <ul className="space-y-2">
                  {selectedDocs.map((doc) => {
                    const document = documents.find(d => d.id === doc.document_id);
                    return (
                      <li 
                        key={doc.document_id} 
                        className="flex justify-between items-center p-2 bg-muted rounded-md"
                      >
                        <span>
                          {document?.name || doc.name || `Документ ID:${doc.document_id}`}
                        </span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeDocument(doc.document_id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Скасувати
          </Button>
          <Button type="submit">
            {initialData ? 'Зберегти зміни' : 'Додати захід'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
