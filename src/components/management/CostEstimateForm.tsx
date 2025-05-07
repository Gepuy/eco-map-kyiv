import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFacilities } from '@/hooks/useFacilities';
import { useFacilityMeasures } from '@/hooks/useFacilityMeasures';
import { MeasureCost, MeasureStatus } from '@/types/managementTypes';
import { FileSpreadsheet, FileText } from 'lucide-react';
import { exportCostEstimateToExcel, exportCostEstimateToWord } from '@/utils/exportUtils';

export const CostEstimateForm = () => {
  const { facilities } = useFacilities();
  
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  const { measures: facilityMeasures, loading } = useFacilityMeasures(
    selectedFacilityId ? parseInt(selectedFacilityId, 10) : undefined
  );
  
  const [costEstimate, setCostEstimate] = useState<MeasureCost[]>([]);
  const [totalCost, setTotalCost] = useState(0);
  
  // При зміні вибраного об'єкту або статусу, розраховуємо кошторис
  useEffect(() => {
    if (!loading && facilityMeasures.length > 0) {
      // Фільтруємо заходи за статусом, якщо вибрано конкретний статус
      const filteredMeasures = selectedStatus === 'all' 
        ? facilityMeasures 
        : facilityMeasures.filter(m => m.status === selectedStatus);
      
      // Перетворюємо дані для кошторису
      const costData: MeasureCost[] = filteredMeasures.map(item => {
        const measure = item.measure;
        
        // Отримуємо ресурси для заходу, якщо вони є
        const resources = (measure?.resources || []).map(resource => ({
          name: resource.resource?.name || 'Невідомий ресурс',
          quantity: resource.quantity,
          unitPrice: resource.resource?.price_per_unit || 0,
          totalPrice: resource.quantity * (resource.resource?.price_per_unit || 0)
        }));
        
        return {
          id: item.measure_id || 0,
          name: measure?.name || 'Невідомий захід',
          totalCost: measure?.cost || 0,
          resources
        };
      });
      
      setCostEstimate(costData);
      setTotalCost(costData.reduce((sum, item) => sum + item.totalCost, 0));
    } else {
      setCostEstimate([]);
      setTotalCost(0);
    }
  }, [loading, facilityMeasures, selectedStatus]);
  
  // Функція для форматування суми у гривні
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('uk-UA', { 
      style: 'currency', 
      currency: 'UAH',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Отримуємо назву вибраного об'єкту
  const getSelectedFacilityName = () => {
    if (!selectedFacilityId) return 'Всі об\'єкти';
    const facility = facilities.find(f => f.id === parseInt(selectedFacilityId, 10));
    return facility ? facility.name : 'Невідомий об\'єкт';
  };
  
  // Експорт кошторису
  const handleExportToWord = () => {
    const title = `Кошторис витрат - ${getSelectedFacilityName()}`;
    exportCostEstimateToWord(costEstimate, title);
  };
  
  const handleExportToExcel = () => {
    const title = `Кошторис витрат - ${getSelectedFacilityName()}`;
    exportCostEstimateToExcel(costEstimate, title);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2">
          <label htmlFor="facility" className="text-sm font-medium mb-2 block">
            Об'єкт
          </label>
          <Select 
            value={selectedFacilityId} 
            onValueChange={setSelectedFacilityId}
          >
            <SelectTrigger id="facility">
              <SelectValue placeholder="Виберіть об'єкт" />
            </SelectTrigger>
            <SelectContent>
              {facilities.map(facility => (
                <SelectItem key={facility.id} value={facility.id.toString()}>
                  {facility.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-1/2">
          <label htmlFor="status" className="text-sm font-medium mb-2 block">
            Статус заходів
          </label>
          <Select 
            value={selectedStatus} 
            onValueChange={setSelectedStatus}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Всі статуси" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Всі статуси</SelectItem>
              <SelectItem value={MeasureStatus.PLANNED}>Заплановані</SelectItem>
              <SelectItem value={MeasureStatus.IN_PROGRESS}>В процесі</SelectItem>
              <SelectItem value={MeasureStatus.COMPLETED}>Завершені</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Кошторис витрат</CardTitle>
            <CardDescription>
              {selectedFacilityId 
                ? `Розрахунок витрат для об'єкту "${getSelectedFacilityName()}"`
                : 'Виберіть об\'єкт для розрахунку витрат'}
            </CardDescription>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExportToWord}
              disabled={costEstimate.length === 0}
            >
              <FileText className="mr-2 h-4 w-4" /> Word
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExportToExcel}
              disabled={costEstimate.length === 0}
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" /> Excel
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Завантаження...</div>
          ) : costEstimate.length > 0 ? (
            <Table>
              <TableCaption>Загальна вартість: {formatCurrency(totalCost)}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Назва заходу</TableHead>
                  <TableHead>Ресурси</TableHead>
                  <TableHead className="text-right">Вартість</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {costEstimate.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {item.resources.map((resource, idx) => (
                          <div key={idx} className="text-sm">
                            {resource.name} - {resource.quantity} од. ({formatCurrency(resource.unitPrice)} за од.)
                          </div>
                        ))}
                        {item.resources.length === 0 && (
                          <span className="text-muted-foreground text-sm">Ресурси не вказані</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(item.totalCost)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : selectedFacilityId ? (
            <div className="text-center py-8 text-gray-500">
              Немає заходів для розрахунку кошторису
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Виберіть об'єкт для відображення кошторису
            </div>
          )}
        </CardContent>
        
        {costEstimate.length > 0 && (
          <CardFooter className="flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Кількість заходів: {costEstimate.length}
              </p>
            </div>
            <div>
              <p className="font-bold">
                Загальна вартість: {formatCurrency(totalCost)}
              </p>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};
