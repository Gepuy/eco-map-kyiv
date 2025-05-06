
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, CardContent, CardDescription, 
  CardHeader, CardTitle, CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, Edit, FileText, Layers, 
  Clock, DollarSign, BarChart
} from 'lucide-react';
import { useMeasures } from '@/hooks/useMeasures';
import { Separator } from '@/components/ui/separator';
import { MeasureResource, MeasureLegalDoc } from '@/types/managementTypes';

const MeasureDetails = () => {
  const { id } = useParams<{ id: string }>();
  const measureId = parseInt(id || '0', 10);
  const navigate = useNavigate();
  
  const { getMeasureDetails } = useMeasures();
  const [loading, setLoading] = useState(true);
  const [measure, setMeasure] = useState<any>(null);
  
  useEffect(() => {
    const fetchMeasureDetails = async () => {
      if (measureId) {
        setLoading(true);
        const data = await getMeasureDetails(measureId);
        if (data) {
          setMeasure(data);
        } else {
          // Якщо захід не знайдено, повертаємося до списку
          navigate('/management/measures');
        }
        setLoading(false);
      }
    };
    
    fetchMeasureDetails();
  }, [measureId, getMeasureDetails, navigate]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center">
        <div className="text-center">Завантаження...</div>
      </div>
    );
  }

  if (!measure) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center">
        <div className="text-center">Захід не знайдено</div>
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
    <div className="container mx-auto py-8">
      <Button 
        variant="outline" 
        className="mb-6"
        onClick={() => navigate('/management/measures')}
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Назад до списку
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{measure.name}</CardTitle>
                  <CardDescription>
                    {measure.category && (
                      <Badge className={`mt-2 ${getCategoryColor(measure.category_id)}`}>
                        {measure.category.name}
                      </Badge>
                    )}
                  </CardDescription>
                </div>
                <Button variant="outline" onClick={() => navigate(`/management/measures/${measureId}/edit`)}>
                  <Edit className="mr-2 h-4 w-4" /> Редагувати
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {measure.description && (
                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <FileText className="mr-2 h-5 w-5" /> Опис заходу
                  </h3>
                  <p className="text-gray-700">{measure.description}</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <BarChart className="mr-2 h-5 w-5" />
                    <h3 className="text-lg font-medium">Ефективність</h3>
                  </div>
                  <p className="text-2xl font-bold">{measure.effectiveness}%</p>
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Clock className="mr-2 h-5 w-5" />
                    <h3 className="text-lg font-medium">Час виконання</h3>
                  </div>
                  <p className="text-2xl font-bold">{measure.estimated_time || '—'} днів</p>
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <DollarSign className="mr-2 h-5 w-5" />
                    <h3 className="text-lg font-medium">Вартість</h3>
                  </div>
                  <p className="text-2xl font-bold">{formatCurrency(measure.cost)}</p>
                </div>
              </div>
              
              {measure.resources && measure.resources.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    <Layers className="mr-2 h-5 w-5" /> Необхідні ресурси
                  </h3>
                  <div className="space-y-2">
                    {measure.resources.map((resourceItem: MeasureResource) => (
                      <div 
                        key={resourceItem.id} 
                        className="flex justify-between items-center p-3 bg-muted/50 rounded-md"
                      >
                        <div>
                          <p className="font-medium">{resourceItem.resource?.name}</p>
                          <p className="text-sm text-gray-500">{resourceItem.resource?.type}</p>
                        </div>
                        <div className="text-right">
                          <p>{resourceItem.quantity} {resourceItem.resource?.unit}</p>
                          <p className="text-sm">{formatCurrency(resourceItem.resource?.price_per_unit || 0)} за одиницю</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Законодавчі документи</CardTitle>
              <CardDescription>Документи, які регулюють впровадження заходу</CardDescription>
            </CardHeader>
            
            <CardContent>
              {measure.legal_documents && measure.legal_documents.length > 0 ? (
                <ul className="space-y-3">
                  {measure.legal_documents.map((docItem: MeasureLegalDoc) => (
                    <li key={docItem.id} className="p-3 bg-muted/50 rounded-md">
                      <p className="font-medium">{docItem.document?.name}</p>
                      <p className="text-sm text-gray-500 mb-1">№ {docItem.document?.number} від {formatDate(docItem.document?.date)}</p>
                      {docItem.document?.link && (
                        <a 
                          href={docItem.document.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Переглянути документ
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Немає пов'язаних документів
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MeasureDetails;
