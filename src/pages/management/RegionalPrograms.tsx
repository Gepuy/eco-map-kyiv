
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, CardContent, CardDescription, 
  CardHeader, CardTitle, CardFooter 
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Calendar, FileText, FileSpreadsheet } from 'lucide-react';
import { useRegionalPrograms } from '@/hooks/useRegionalPrograms';
import { RegionalProgram } from '@/types/managementTypes';
import { useNavigate } from 'react-router-dom';
import { exportToExcel, exportRegionalProgramToWord } from '@/utils/exportUtils';

const RegionalPrograms = () => {
  const navigate = useNavigate();
  const { programs, loading, addProgram } = useRegionalPrograms();
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  // Стан для форми
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');

  const handleAddProgram = async () => {
    if (!name || !startDate || !endDate || !budget) return;
    
    const newProgram: Omit<RegionalProgram, 'id'> = {
      name,
      description,
      start_date: startDate,
      end_date: endDate,
      budget: parseFloat(budget)
    };
    
    const result = await addProgram(newProgram);
    if (result) {
      // Очищаємо форму
      setName('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setBudget('');
      
      // Закриваємо діалог
      setShowAddDialog(false);
      
      // Переходимо на сторінку програми
      navigate(`/management/programs/${result.id}/edit`);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('uk-UA', { 
      style: 'currency', 
      currency: 'UAH',
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Експорт списку програм
  const handleExportToExcel = () => {
    // Підготовка даних для експорту
    const exportData = programs.map(program => ({
      'Назва програми': program.name,
      'Початок': formatDate(program.start_date),
      'Кінець': formatDate(program.end_date),
      'Бюджет': program.budget,
      'Опис': program.description || 'Опис відсутній'
    }));
    
    exportToExcel(exportData, 'Програми розвитку регіону');
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <h1 className="text-3xl font-bold">Програми розвитку регіону</h1>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportToExcel} disabled={loading || programs.length === 0}>
            <FileSpreadsheet className="mr-2 h-4 w-4" /> Експорт
          </Button>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" /> Нова програма
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-8">Завантаження...</div>
      ) : programs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <Card key={program.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="truncate">{program.name}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(program.start_date)} - {formatDate(program.end_date)}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="font-semibold text-xl mb-2">{formatCurrency(program.budget)}</div>
                <p className="text-muted-foreground line-clamp-2">
                  {program.description || 'Опис відсутній'}
                </p>
              </CardContent>
              
              <CardFooter className="flex justify-between pt-3">
                <Button variant="outline" onClick={() => navigate(`/management/programs/${program.id}`)}>
                  Деталі
                </Button>
                <Button onClick={() => navigate(`/management/programs/${program.id}/edit`)}>
                  Управління
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-muted rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Немає програм</h3>
          <p className="text-muted-foreground mb-4">
            Додайте першу програму розвитку регіону
          </p>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" /> Додати програму
          </Button>
        </div>
      )}
      
      {/* Діалог додавання програми */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Нова програма розвитку</DialogTitle>
            <DialogDescription>
              Створіть нову програму розвитку регіону. Після створення ви зможете додати до неї заходи.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Назва програми</label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Введіть назву програми"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Опис програми</label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Введіть опис програми"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="start-date" className="text-sm font-medium">Дата початку</label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="end-date" className="text-sm font-medium">Дата завершення</label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="budget" className="text-sm font-medium">Бюджет (грн)</label>
              <Input
                id="budget"
                type="number"
                min="0"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Введіть бюджет програми"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Скасувати
            </Button>
            <Button 
              onClick={handleAddProgram}
              disabled={!name || !startDate || !endDate || !budget}
            >
              Створити програму
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RegionalPrograms;
