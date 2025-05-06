
import React from 'react';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Measure } from '@/types/managementTypes';
import { MoreHorizontal, Pencil, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MeasuresListProps {
  measures: Measure[];
  loading: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
}

export function MeasuresList({ 
  measures, 
  loading, 
  onEdit, 
  onDelete,
  onView
}: MeasuresListProps) {
  const navigate = useNavigate();

  if (loading) {
    return <div className="text-center py-4">Завантаження...</div>;
  }

  if (measures.length === 0) {
    return <div className="text-center py-4">Немає заходів для відображення</div>;
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('uk-UA', { 
      style: 'currency', 
      currency: 'UAH',
      maximumFractionDigits: 0
    }).format(value);
  };

  const getCategoryColor = (categoryId: number | null | undefined) => {
    switch(categoryId) {
      case 1: return "bg-blue-500"; // Повітря
      case 2: return "bg-cyan-500";  // Вода
      case 3: return "bg-green-500"; // Ґрунт
      case 4: return "bg-yellow-500"; // Енергетика
      case 5: return "bg-gray-500";  // Відходи
      default: return "bg-slate-500";
    }
  };

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableCaption>Список заходів</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">ID</TableHead>
            <TableHead>Назва</TableHead>
            <TableHead>Категорія</TableHead>
            <TableHead className="text-right">Ефективність</TableHead>
            <TableHead className="text-right">Вартість</TableHead>
            <TableHead className="w-[100px] text-right">Дії</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {measures.map((measure) => (
            <TableRow key={measure.id}>
              <TableCell className="font-medium">{measure.id}</TableCell>
              <TableCell>{measure.name}</TableCell>
              <TableCell>
                {measure.category ? (
                  <Badge className={getCategoryColor(measure.category_id)}>
                    {measure.category.name}
                  </Badge>
                ) : null}
              </TableCell>
              <TableCell className="text-right">
                {measure.effectiveness ? `${measure.effectiveness}%` : 'Не вказано'}
              </TableCell>
              <TableCell className="text-right">{formatCurrency(measure.cost)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Відкрити меню</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView(measure.id)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Детально
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(measure.id)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Редагувати
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(measure.id)} className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Видалити
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
