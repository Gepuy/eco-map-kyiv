import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, CardContent, CardDescription, 
  CardHeader, CardTitle, CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from '@/components/ui/separator';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import {
  BarChart,
  PieChart,
  Bar,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { ChevronLeft, Edit, FileText, FileSpreadsheet } from 'lucide-react';
import { useRegionalPrograms } from '@/hooks/useRegionalPrograms';
import { ProgramReport, CategoryStatistics } from '@/types/managementTypes';
import { exportRegionalProgramToWord, exportToExcel } from '@/utils/exportUtils';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD'];

const ProgramDetails = () => {
  const { id } = useParams<{ id: string }>();
  const programId = parseInt(id || '0', 10);
  const navigate = useNavigate();
  
  const { getProgramDetails, getCategoriesStatistics } = useRegionalPrograms();
  const [loading, setLoading] = useState(true);
  const [programReport, setProgramReport] = useState<ProgramReport | null>(null);
  const [stats, setStats] = useState<CategoryStatistics[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      if (programId) {
        setLoading(true);
        
        const [reportData, statsData] = await Promise.all([
          getProgramDetails(programId),
          getCategoriesStatistics()
        ]);
        
        if (reportData) {
          setProgramReport(reportData);
        } else {
          // Якщо програма не знайдена, повертаємося до списку
          navigate('/management/programs');
        }
        
        setStats(statsData);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [programId, getProgramDetails, getCategoriesStatistics, navigate]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center">
        <div className="text-center">Завантаження...</div>
      </div>
    );
  }

  if (!programReport) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center">
        <div className="text-center">Програму не знайдено</div>
      </div>
    );
  }

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

  // Дані для графіку розподілу за роками
  const yearData = programReport.years.map(year => ({
    name: year.toString(),
    value: programReport.totalByYear[year]
  }));

  // Дані для графіку розподілу за категоріями
  const categoryData = programReport.categoriesDistribution.map(cat => ({
    name: cat.categoryName,
    value: cat.funding
  }));

  // Експорт програми
  const handleExportToWord = () => {
    exportRegionalProgramToWord(
      programReport, 
      `Програма розвитку - ${programReport.program.name}`
    );
  };
  
  const handleExportToExcel = () => {
    // Підготовка даних для експорту
    const exportData = [];
    
    // Загальна інформація
    exportData.push({
      'Тип': 'Загальна інформація',
      'Назва програми': programReport.program.name,
      'Термін дії': `${formatDate(programReport.program.start_date)} - ${formatDate(programReport.program.end_date)}`,
      'Бюджет': programReport.totalBudget,
      'Кількість заходів': programReport.measuresCount
    });
    
    // Заходи по рокам
    programReport.years.forEach(year => {
      programReport.measuresByYear[year].forEach((measure) => {
        exportData.push({
          'Тип': `Захід (${year})`,
          'Назва заходу': measure.measure?.name || 'Невідомий захід',
          'Категорія': measure.measure?.category?.name || 'Не вказано',
          'Фінансування': measure.planned_funding,
          'Рік': year
        });
      });
    });
    
    exportToExcel(exportData, `Програма розвитку - ${programReport.program.name}`);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/management/programs')}
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Назад до програм
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportToWord}>
            <FileText className="mr-2 h-4 w-4" /> Word
          </Button>
          <Button variant="outline" onClick={handleExportToExcel}>
            <FileSpreadsheet className="mr-2 h-4 w-4" /> Excel
          </Button>
          <Button onClick={() => navigate(`/management/programs/${programId}/edit`)}>
            <Edit className="mr-2 h-4 w-4" /> Редагувати
          </Button>
        </div>
      </div>
      
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <CardTitle className="text-3xl">{programReport.program.name}</CardTitle>
                <CardDescription className="text-lg mt-1">
                  {formatDate(programReport.program.start_date)} - {formatDate(programReport.program.end_date)}
                </CardDescription>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="text-2xl font-bold">{formatCurrency(programReport.totalBudget)}</div>
                <div className="text-sm text-muted-foreground">Загальний бюджет</div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {programReport.program.description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Опис програми</h3>
                <p className="text-gray-700">{programReport.program.description}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="py-4 px-6">
                  <CardTitle className="text-base">Всього заходів</CardTitle>
                </CardHeader>
                <CardContent className="py-2 px-6">
                  <p className="text-3xl font-bold">{programReport.measuresCount}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-4 px-6">
                  <CardTitle className="text-base">Кількість років</CardTitle>
                </CardHeader>
                <CardContent className="py-2 px-6">
                  <p className="text-3xl font-bold">{programReport.years.length}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-4 px-6">
                  <CardTitle className="text-base">Категорій</CardTitle>
                </CardHeader>
                <CardContent className="py-2 px-6">
                  <p className="text-3xl font-bold">{programReport.categoriesDistribution.length}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-4 px-6">
                  <CardTitle className="text-base">Фактичні витрати</CardTitle>
                </CardHeader>
                <CardContent className="py-2 px-6">
                  <p className="text-3xl font-bold">{formatCurrency(
                    Object.values(programReport.totalByYear).reduce((sum, val) => sum + val, 0)
                  )}</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Розподіл за роками</CardTitle>
              <CardDescription>
                Бюджетні витрати по рокам впровадження програми
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={yearData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `₴${value/1000}K`} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Bar dataKey="value" name="Бюджет" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Розподіл за категоріями</CardTitle>
              <CardDescription>
                Фінансування за напрямками діяльності
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {programReport.years.map(year => (
          <Card key={year}>
            <CardHeader>
              <CardTitle>{year} рік</CardTitle>
              <CardDescription>
                Заплановані заходи та фінансування на {year} рік: 
                {formatCurrency(programReport.totalByYear[year])}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Назва заходу</TableHead>
                    <TableHead>Категорія</TableHead>
                    <TableHead>Ефективність</TableHead>
                    <TableHead className="text-right">Фінансування</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {programReport.measuresByYear[year].map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.measure?.name}</TableCell>
                      <TableCell>{item.measure?.category?.name}</TableCell>
                      <TableCell>{item.measure?.effectiveness}%</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.planned_funding)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableCaption className="pt-2">
                  Всього заходів: {programReport.measuresByYear[year].length}
                </TableCaption>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProgramDetails;
