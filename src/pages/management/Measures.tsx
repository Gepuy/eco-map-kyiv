
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { MeasuresList } from '@/components/management/MeasuresList';
import { MeasureForm } from '@/components/management/MeasureForm';
import { Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMeasures } from '@/hooks/useMeasures';
import { useCategories } from '@/hooks/useCategories';
import { Measure } from '@/types/managementTypes';

const Measures = () => {
  const navigate = useNavigate();
  const { measures, loading, addMeasure, deleteMeasure } = useMeasures();
  const { categories } = useCategories();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  // Фільтрація заходів за пошуком та категорією
  const filteredMeasures = measures.filter(measure => {
    const matchesSearch = measure.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || measure.category_id === parseInt(selectedCategory, 10);
    return matchesSearch && matchesCategory;
  });

  // Обробники подій
  const handleAddMeasure = async (
    measure: Omit<Measure, 'id'>,
    resources: { resource_id: number, quantity: number }[],
    legalDocs: { document_id: number }[]
  ) => {
    await addMeasure(measure, resources, legalDocs);
    setShowAddForm(false);
  };

  const handleEditMeasure = (id: number) => {
    navigate(`/management/measures/${id}/edit`);
  };

  const handleViewMeasure = (id: number) => {
    navigate(`/management/measures/${id}`);
  };

  const handleDeleteClick = (id: number) => {
    setConfirmDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (confirmDeleteId) {
      await deleteMeasure(confirmDeleteId);
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <h1 className="text-3xl font-bold">Управління заходами</h1>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="mr-2 h-4 w-4" /> Додати новий захід
        </Button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                className="pl-8"
                placeholder="Пошук заходів..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-full md:w-64">
              <Select 
                value={selectedCategory} 
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Фільтр за категорією" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Всі категорії</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <MeasuresList
          measures={filteredMeasures}
          loading={loading}
          onEdit={handleEditMeasure}
          onDelete={handleDeleteClick}
          onView={handleViewMeasure}
        />
      </div>

      {/* Форма додавання заходу */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Додати новий захід</DialogTitle>
            <DialogDescription>
              Заповніть форму для додавання нового заходу до бази даних.
            </DialogDescription>
          </DialogHeader>
          
          <MeasureForm
            onSubmit={handleAddMeasure}
            onCancel={() => setShowAddForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Діалог підтвердження видалення */}
      <Dialog open={confirmDeleteId !== null} onOpenChange={() => setConfirmDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Підтвердіть видалення</DialogTitle>
            <DialogDescription>
              Ви дійсно хочете видалити цей захід? Ця дія не може бути скасована.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>
              Скасувати
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Видалити
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Measures;
