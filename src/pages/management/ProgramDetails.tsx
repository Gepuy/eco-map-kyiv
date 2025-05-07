
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRegionalPrograms } from '@/hooks/useRegionalPrograms';
import {
  Card, CardContent, CardDescription,
  CardHeader, CardTitle, CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft, Edit, FileText, CalendarDays,
  DollarSign, BarChart2, PieChart
} from 'lucide-react';
import { ProgramReport, ProgramMeasure } from '@/types/managementTypes';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from "@/components/ui/tabs";
import { BarChart } from '@/components/ui/bar-chart';
import { exportProgramToExcel } from '@/utils/exportUtils';

const ProgramDetails = () => {
  const { id } = useParams<{ id: string }>();
  const programId = parseInt(id || '0', 10);
  const navigate = useNavigate();
  
  const { getProgramDetails } = useRegionalPrograms();
  const [loading, setLoading] = useState(true);
  const [programReport, setProgramReport] = useState<ProgramReport | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  
  useEffect(() => {
    const fetchProgramDetails = async () => {
      if (programId && !hasLoaded) {
        setLoading(true);
        const data = await getProgramDetails(programId);
        if (data) {
          setProgramReport(data);
        } else {
          // Якщо програму не знайдено, повертаємося до списку
          navigate('/management/programs');
        }
        setLoading(false);
        setHasLoaded(true);
      }
    };
    
    fetchProgramDetails();
  }, [programId, getProgramDetails, navigate, hasLoaded]);

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

  const { program, years, totalBudget, measuresCount, measuresByYear, totalByYear, categoriesDistribution } = programReport;

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

  return (
    <div className="container mx-auto py-8">
      <Button 
        variant="outline" 
        className="mb-6"
        onClick={() => navigate('/management/programs')}
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Назад до списку
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{program.name}</CardTitle>
                  <CardDescription>
                    {program.description}
                  </CardDescription>
                </div>
                <Button variant="outline" onClick={() => navigate(`/management/programs/${programId}/edit`)}>
                  <Edit className="mr-2 h-4 w-4" /> Редагувати
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <CalendarDays className="mr-2 h-5 w-5" />
                    <h3 className="text-lg font-medium">Період дії</h3>
                  </div>
                  <p className="text-xl font-bold">
                    {formatDate(program.start_date)} - {formatDate(program.end_date)}
                  </p>
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <DollarSign className="mr-2 h-5 w-5" />
                    <h3 className="text-lg font-medium">Бюджет</h3>
                  </div>
                  <p className="text-2xl font-bold">{formatCurrency(program.budget)}</p>
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <FileText className="mr-2 h-5 w-5" />
                    <h3 className="text-lg font-medium">Заходів</h3>
                  </div>
                  <p className="text-2xl font-bold">{measuresCount}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <BarChart2 className="mr-2 h-5 w-5" /> Розподіл бюджету по категоріям
                </h3>
                
                {categoriesDistribution.length > 0 ? (
                  <BarChart 
                    data={categoriesDistribution}
                    index="categoryName"
                    value="percentage"
                    formatter={(value: number) => `${value.toFixed(1)}%`}
                  />
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Немає даних для відображення розподілу по категоріям
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Заходи за роками</CardTitle>
              <CardDescription>Інформація про заходи, що реалізуються в рамках програми</CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue={years[0].toString()} className="w-full">
                <TabsList>
                  {years.map(year => (
                    <TabsTrigger key={year} value={year.toString()}>
                      {year}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {years.map(year => (
                  <TabsContent key={year} value={year.toString()}>
                    {measuresByYear[year] && measuresByYear[year].length > 0 ? (
                      <Table>
                        <TableCaption>Заходи на {year} рік</TableCaption>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Назва</TableHead>
                            <TableHead className="text-right">Бюджет</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {measuresByYear[year].map((measure: ProgramMeasure) => (
                            <TableRow key={measure.id}>
                              <TableCell className="font-medium">{measure.measure?.name}</TableCell>
                              <TableCell className="text-right">{formatCurrency(measure.planned_funding)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        Немає заходів на {year} рік
                      </p>
                    )}
                    <div className="mt-4 text-right font-bold">
                      Загальний бюджет на {year} рік: {formatCurrency(totalByYear[year])}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
            
            <CardFooter>
              <Button onClick={() => exportProgramToExcel(programReport)}>
                <FileText className="mr-2 h-4 w-4" /> Експортувати в Excel
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetails;
