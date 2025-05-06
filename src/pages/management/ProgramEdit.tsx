
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, CardContent, CardDescription, 
  CardHeader, CardTitle, CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ChevronLeft, Plus, Trash2, AlertTriangle, Save
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMeasures } from '@/hooks/useMeasures';
import { useRegionalPrograms } from '@/hooks/useRegionalPrograms';
import { RegionalProgram } from '@/types/managementTypes';

const ProgramEdit = () => {
  const { id } = useParams<{ id: string }>();
  const programId = parseInt(id || '0', 10);
  const navigate = useNavigate();
  
  const { measures } = useMeasures();
  const { getProgramDetails, updateProgram, deleteProgram } = useRegionalPrograms();
  
  // Стан програми
  const [loading, setLoading] = useState(true);
  const [programReport, setProgramReport] = useState<any>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  
  // Заходи програми
  const [programMeasures, setProgramMeasures] = useState<any[]>([]);
  
  // Стан для модального вікна додавання заходу
  const [showAddMeasureDialog, setShowAddMeasureDialog] = useState(false);
  const [selectedMeasureId, setSelectedMeasureId] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [plannedFunding, setPlannedFunding] = useState('');
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  
  // Стан для діалогу підтвердження видалення
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [measureToDeleteIndex, setMeasureToDeleteIndex] = useState<number | null>(null);
  const [confirmDeleteProgram, setConfirmDeleteProgram] = useState(false);
  
  // Завантажуємо дані програми
  useEffect(() => {
    const fetchProgram = async () => {
      if (programId) {
        setLoading(true);
        const data = await getProgramDetails(programId);
        if (data) {
          setProgramReport(data);
          setName(data.program.name);
          setDescription(data.program.description || '');
          setStartDate(data.program.start_date.split('T')[0]);
          setEndDate(data.program.end_date.split('T')[0]);
          setBudget(data.program.budget.toString());
          
          // Формуємо масив заходів для редагування
          const measures: any[] = [];
          data.years.forEach((year: number) => {
            data.measuresByYear[year].forEach((measure: any) => {
              measures.push({
                measure_id: measure.measure_id,
                year,
                planned_funding: measure.planned_funding,
                measure: measure.measure
              });
            });
          });
          
          setProgramMeasures(measures);
          
          // Розраховуємо доступні роки для вибору
          const startYear = new Date(data.program.start_date).getFullYear();
          const endYear = new Date(data.program.end_date).getFullYear();
          const years = [];
          for (let i = startYear; i <= endYear; i++) {
            years.push(i);
          }
          setAvailableYears(years);
          if (years.length > 0) {
            setSelectedYear(years[0].toString());
          }
        } else {
          // Якщо програму не знайдено, повертаємося до списку
          navigate('/management/programs');
        }
        setLoading(false);
      }
    };
    
    fetchProgram();
  }, [programId, getProgramDetails, navigate]);
  
  // Оновлюємо роки при зміні дат
  useEffect(() => {
    if (startDate && endDate) {
      const startYear = new Date(startDate).getFullYear();
      const endYear = new Date(endDate).getFullYear();
      if (endYear < startYear) return;
      
      const years = [];
      for (let i = startYear; i <= endYear; i++) {
        years.push(i);
      }
      setAvailableYears(years);
      if (years.length > 0) {
        setSelectedYear(years[0].toString());
      }
    }
  }, [startDate, endDate]);
  
  // Доступні для додавання заходи (що ще не додані до програми)
  const getAvailableMeasures = () => {
    return measures.filter(measure => 
      !programMeasures.some(pm => 
        pm.measure_id === measure.id && 
        pm.year === parseInt(selectedYear, 10)
      )
    );
  };
  
  // Обробники подій
  const handleDateChange = (field: string, value: string) => {
    if (field === 'startDate') {
      setStartDate(value);
    } else if (field === 'endDate') {
      setEndDate(value);
    }
    
    // Перевіряємо, чи потрібно видалити заходи, що не входять у новий діапазон дат
    if (startDate && endDate) {
      const startYear = new Date(field === 'startDate' ? value : startDate).getFullYear();
      const endYear = new Date(field === 'endDate' ? value : endDate).getFullYear();
      
      // Фільтруємо заходи, що не входять у новий діапазон
      const filteredMeasures = programMeasures.filter(pm => 
        pm.year >= startYear && pm.year <= endYear
      );
      
      if (filteredMeasures.length < programMeasures.length) {
        setProgramMeasures(filteredMeasures);
      }
    }
  };
  
  const handleAddMeasure = () => {
    if (!selectedMeasureId || !selectedYear || !plannedFunding) return;
    
    const measureId = parseInt(selectedMeasureId, 10);
    const year = parseInt(selectedYear, 10);
    const funding = parseFloat(plannedFunding);
    
    // Перевіряємо, чи вже є такий захід для вибраного року
    const exists = programMeasures.some(pm => 
      pm.measure_id === measureId && pm.year === year
    );
    
    if (exists) return;
    
    // Додаємо захід
    const measure = measures.find(m => m.id === measureId);
    setProgramMeasures([
      ...programMeasures,
      {
        measure_id: measureId,
        year,
        planned_funding: funding,
        measure
      }
    ]);
    
    // Очищаємо форму
    setSelectedMeasureId('');
    setPlannedFunding('');
    setShowAddMeasureDialog(false);
  };
  
  const handleDeleteMeasure = (index: number) => {
    setMeasureToDeleteIndex(index);
    setShowDeleteDialog(true);
  };
  
  const confirmDeleteMeasure = () => {
    if (measureToDeleteIndex !== null) {
      const newMeasures = [...programMeasures];
      newMeasures.splice(measureToDeleteIndex, 1);
      setProgramMeasures(newMeasures);
      setMeasureToDeleteIndex(null);
      setShowDeleteDialog(false);
    }
  };
  
  const handleSaveProgram = async () => {
    if (!name || !startDate || !endDate || !budget) return;
    
    const programData: Partial<RegionalProgram> = {
      name,
      description,
      start_date: startDate,
      end_date: endDate,
      budget: parseFloat(budget)
    };
    
    const measureData = programMeasures.map(pm => ({
      measure_id: pm.measure_id,
      year: pm.year,
      planned_funding: pm.planned_funding
    }));
    
    const success = await updateProgram(programId, programData, measureData);
    if (success) {
      navigate(`/management/programs/${programId}`);
    }
  };
  
  const handleDeleteProgram = async () => {
    const success = await deleteProgram(programId);
    if (success) {
      navigate('/management/programs');
    }
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('uk-UA', { 
      style: 'currency', 
      currency: 'UAH',
      maximumFractionDigits: 0
    }).format(value);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Завантаження...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Button 
        variant="outline" 
        className="mb-6"
        onClick={() => navigate(`/management/programs/${programId}`)}
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Назад до перегляду
      </Button>
      
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Редагування програми</CardTitle>
            <CardDescription>
              Оновіть інформацію про програму розвитку регіону
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
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
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="start-date" className="text-sm font-medium">Дата початку</label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => handleDateChange('startDate', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="end-date" className="text-sm font-medium">Дата завершення</label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => handleDateChange('endDate', e.target.value)}
                  />
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
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between border-t pt-4">
            <Button 
              variant="destructive" 
              onClick={() => setConfirmDeleteProgram(true)}
            >
              Видалити програму
            </Button>
            
            <Button 
              onClick={handleSaveProgram}
              disabled={!name || !startDate || !endDate || !budget}
            >
              <Save className="mr-2 h-4 w-4" /> Зберегти зміни
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <div>
              <CardTitle>Заходи програми</CardTitle>
              <CardDescription>
                Керуйте заходами, які входять до програми розвитку
              </CardDescription>
            </div>
            
            <Button onClick={() => setShowAddMeasureDialog(true)} disabled={availableYears.length === 0}>
              <Plus className="mr-2 h-4 w-4" /> Додати захід
            </Button>
          </CardHeader>
          
          <CardContent>
            {programMeasures.length > 0 ? (
              <div className="space-y-6">
                {availableYears.map(year => {
                  const yearMeasures = programMeasures.filter(m => m.year === year);
                  if (yearMeasures.length === 0) return null;
                  
                  return (
                    <div key={year}>
                      <h3 className="text-lg font-medium mb-2">{year} рік</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Назва заходу</TableHead>
                            <TableHead>Категорія</TableHead>
                            <TableHead className="text-right">Фінансування</TableHead>
                            <TableHead className="w-[80px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {yearMeasures.map((item, index) => (
                            <TableRow key={`${item.measure_id}-${item.year}`}>
                              <TableCell className="font-medium">
                                {item.measure?.name || `Захід #${item.measure_id}`}
                              </TableCell>
                              <TableCell>
                                {item.measure?.category?.name || 'Не вказано'}
                              </TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(item.planned_funding)}
                              </TableCell>
                              <TableCell>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleDeleteMeasure(
                                    programMeasures.findIndex(m => 
                                      m.measure_id === item.measure_id && m.year === item.year
                                    )
                                  )}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                        <TableCaption className="pt-2">
                          Заходів на {year} рік: {yearMeasures.length} | 
                          Фінансування: {formatCurrency(
                            yearMeasures.reduce((sum, item) => sum + item.planned_funding, 0)
                          )}
                        </TableCaption>
                      </Table>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Немає заходів у програмі. Додайте перший захід.
              </div>
            )}
          </CardContent>
          
          <CardFooter className="border-t pt-4">
            <div className="w-full flex justify-end">
              <div className="text-xl font-semibold">
                Загальне фінансування: {formatCurrency(
                  programMeasures.reduce((sum, item) => sum + item.planned_funding, 0)
                )}
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
      
      {/* Діалог додавання заходу */}
      <Dialog open={showAddMeasureDialog} onOpenChange={setShowAddMeasureDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Додати захід до програми</DialogTitle>
            <DialogDescription>
              Виберіть захід, рік впровадження та заплановане фінансування.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="measure" className="text-sm font-medium">Захід</label>
              <Select 
                value={selectedMeasureId} 
                onValueChange={setSelectedMeasureId}
              >
                <SelectTrigger id="measure">
                  <SelectValue placeholder="Виберіть захід" />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  {getAvailableMeasures().map(measure => (
                    <SelectItem key={measure.id} value={measure.id.toString()}>
                      {measure.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="year" className="text-sm font-medium">Рік впровадження</label>
                <Select 
                  value={selectedYear} 
                  onValueChange={setSelectedYear}
                >
                  <SelectTrigger id="year">
                    <SelectValue placeholder="Виберіть рік" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableYears.map(year => (
                      <SelectItem key={year} value={year.toString()}>
                        {year} рік
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="funding" className="text-sm font-medium">Фінансування (грн)</label>
                <Input
                  id="funding"
                  type="number"
                  min="0"
                  value={plannedFunding}
                  onChange={(e) => setPlannedFunding(e.target.value)}
                  placeholder="Введіть суму"
                />
              </div>
            </div>
            
            {selectedMeasureId && (
              <div className="pt-2">
                <div className="text-sm font-medium mb-1">Деталі заходу:</div>
                <div className="bg-muted p-3 rounded-md">
                  {measures.find(m => m.id === parseInt(selectedMeasureId, 10))?.description ||
                    'Опис відсутній'}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddMeasureDialog(false)}>
              Скасувати
            </Button>
            <Button 
              onClick={handleAddMeasure}
              disabled={!selectedMeasureId || !selectedYear || !plannedFunding}
            >
              Додати захід
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Діалог підтвердження видалення заходу */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              Підтвердіть видалення
            </DialogTitle>
            <DialogDescription>
              Ви дійсно хочете видалити цей захід з програми? Ця дія не може бути скасована.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Скасувати
            </Button>
            <Button variant="destructive" onClick={confirmDeleteMeasure}>
              Видалити
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Діалог підтвердження видалення програми */}
      <Dialog open={confirmDeleteProgram} onOpenChange={setConfirmDeleteProgram}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              Підтвердіть видалення
            </DialogTitle>
            <DialogDescription>
              Ви дійсно хочете видалити програму "{name}"? Всі пов'язані заходи також будуть видалені.
              Ця дія не може бути скасована.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteProgram(false)}>
              Скасувати
            </Button>
            <Button variant="destructive" onClick={handleDeleteProgram}>
              Видалити програму
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProgramEdit;
