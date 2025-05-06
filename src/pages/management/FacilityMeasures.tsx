
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, CardContent, CardDescription, 
  CardHeader, CardTitle, CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from '@/components/ui/separator';
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
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  ChevronLeft, Plus, Trash2, AlertTriangle, 
  CheckCircle, Circle, Clock
} from 'lucide-react';
import { useMeasures } from '@/hooks/useMeasures';
import { useFacilities } from '@/hooks/useFacilities';
import { useFacilityMeasures } from '@/hooks/useFacilityMeasures';
import { MeasureStatus } from '@/types/managementTypes';
import { Input } from '@/components/ui/input';

const FacilityMeasures = () => {
  const { id } = useParams<{ id: string }>();
  const facilityId = parseInt(id || '0', 10);
  const navigate = useNavigate();
  
  // Отримуємо дані
  const { facilities } = useFacilities();
  const { measures } = useMeasures();
  const { 
    measures: facilityMeasures, 
    loading, 
    addFacilityMeasure,
    updateFacilityMeasure,
    deleteFacilityMeasure
  } = useFacilityMeasures(facilityId);

  // Стан
  const [facility, setFacility] = useState<any>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedMeasureId, setSelectedMeasureId] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<string>('3');
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [implementationDate, setImplementationDate] = useState<string>('');

  // Завантажуємо дані про об'єкт
  useEffect(() => {
    if (facilityId && facilities.length > 0) {
      const foundFacility = facilities.find(f => f.id === facilityId);
      if (foundFacility) {
        setFacility(foundFacility);
      } else {
        // Якщо об'єкт не знайдено, повертаємося до списку
        navigate('/');
      }
    }
  }, [facilityId, facilities, navigate]);

  // Заходи, які можна додати (що ще не додані до об'єкту)
  const availableMeasures = measures.filter(measure => 
    !facilityMeasures.some(fm => fm.measure_id === measure.id)
  );

  // Обробники подій
  const handleAddMeasure = async () => {
    if (selectedMeasureId && selectedPriority) {
      await addFacilityMeasure({
        facility_id: facilityId,
        measure_id: parseInt(selectedMeasureId, 10),
        priority: parseInt(selectedPriority, 10),
        status: MeasureStatus.PLANNED,
        implementation_date: implementationDate || null
      });
      setSelectedMeasureId('');
      setSelectedPriority('3');
      setImplementationDate('');
      setShowAddDialog(false);
    }
  };

  const handleStatusChange = async (id: number, status: MeasureStatus) => {
    await updateFacilityMeasure(id, { status });
  };

  const handleConfirmDelete = async () => {
    if (confirmDeleteId !== null) {
      await deleteFacilityMeasure(confirmDeleteId);
      setConfirmDeleteId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case MeasureStatus.PLANNED:
        return <Badge variant="outline" className="flex items-center gap-1">
          <Circle className="h-3 w-3" /> Заплановано
        </Badge>;
      case MeasureStatus.IN_PROGRESS:
        return <Badge variant="secondary" className="flex items-center gap-1">
          <Clock className="h-3 w-3" /> В процесі
        </Badge>;
      case MeasureStatus.COMPLETED:
        return <Badge variant="success" className="flex items-center gap-1 bg-green-500">
          <CheckCircle className="h-3 w-3" /> Завершено
        </Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('uk-UA', { 
      style: 'currency', 
      currency: 'UAH',
      maximumFractionDigits: 0
    }).format(value);
  };

  if (loading || !facility) {
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
        onClick={() => navigate('/')}
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Назад до об'єктів
      </Button>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">{facility.name}</h1>
          <p className="text-gray-500">{facility.address}</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" /> Додати захід
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Заходи для об'єкту</CardTitle>
          <CardDescription>
            Перелік заходів, призначених для покращення еко-енерго-економічного стану об'єкту
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {facilityMeasures.length > 0 ? (
            <Table>
              <TableCaption>Всього заходів: {facilityMeasures.length}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Назва заходу</TableHead>
                  <TableHead>Категорія</TableHead>
                  <TableHead className="text-center">Пріоритет</TableHead>
                  <TableHead className="text-center">Статус</TableHead>
                  <TableHead className="text-right">Вартість</TableHead>
                  <TableHead className="text-right">Дії</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {facilityMeasures.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.measure?.name}</TableCell>
                    <TableCell>{item.measure?.category?.name}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={
                        item.priority === 1 ? "destructive" :
                        item.priority === 2 ? "secondary" :
                        item.priority === 3 ? "outline" :
                        item.priority === 4 ? "default" :
                        "default"
                      }>
                        {item.priority === 1 ? 'Критичний' :
                         item.priority === 2 ? 'Високий' :
                         item.priority === 3 ? 'Середній' :
                         item.priority === 4 ? 'Низький' :
                         item.priority === 5 ? 'Опціональний' : ''}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Select 
                        value={item.status} 
                        onValueChange={(value) => handleStatusChange(item.id, value as MeasureStatus)}
                      >
                        <SelectTrigger className="w-[140px] h-8">
                          <SelectValue placeholder={getStatusBadge(item.status)} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={MeasureStatus.PLANNED}>Заплановано</SelectItem>
                          <SelectItem value={MeasureStatus.IN_PROGRESS}>В процесі</SelectItem>
                          <SelectItem value={MeasureStatus.COMPLETED}>Завершено</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(item.measure?.cost || 0)}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setConfirmDeleteId(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6 text-gray-500">
              Для цього об'єкту ще не призначено жодних заходів
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Діалог додавання заходу */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Додати захід для об'єкту</DialogTitle>
            <DialogDescription>
              Виберіть захід та встановіть його пріоритет.
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
                <SelectContent>
                  {availableMeasures.length > 0 ? (
                    availableMeasures.map(measure => (
                      <SelectItem key={measure.id} value={measure.id.toString()}>
                        {measure.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>
                      Всі можливі заходи вже додані
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="priority" className="text-sm font-medium">Пріоритет</label>
              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Виберіть пріоритет" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Критичний</SelectItem>
                  <SelectItem value="2">Високий</SelectItem>
                  <SelectItem value="3">Середній</SelectItem>
                  <SelectItem value="4">Низький</SelectItem>
                  <SelectItem value="5">Опціональний</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="implementation-date" className="text-sm font-medium">
                Дата впровадження (необов'язково)
              </label>
              <Input 
                id="implementation-date"
                type="date"
                value={implementationDate}
                onChange={(e) => setImplementationDate(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Скасувати
            </Button>
            <Button 
              onClick={handleAddMeasure}
              disabled={!selectedMeasureId || availableMeasures.length === 0}
            >
              Додати захід
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Діалог підтвердження видалення */}
      <Dialog open={confirmDeleteId !== null} onOpenChange={() => setConfirmDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              Підтвердіть видалення
            </DialogTitle>
            <DialogDescription>
              Ви дійсно хочете видалити цей захід для об'єкту? Ця дія не може бути скасована.
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

export default FacilityMeasures;
