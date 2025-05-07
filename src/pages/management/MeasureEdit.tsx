
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { MeasureForm } from '@/components/management/MeasureForm';
import { useMeasures } from '@/hooks/useMeasures';
import { Measure } from '@/types/managementTypes';

const MeasureEdit = () => {
  const { id } = useParams<{ id: string }>();
  const measureId = parseInt(id || '0', 10);
  const navigate = useNavigate();
  
  const { getMeasureDetails, updateMeasure } = useMeasures();
  const [loading, setLoading] = useState(true);
  const [measure, setMeasure] = useState<any>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  
  useEffect(() => {
    const fetchMeasureDetails = async () => {
      if (measureId && !hasLoaded) {
        setLoading(true);
        const data = await getMeasureDetails(measureId);
        if (data) {
          setMeasure(data);
        } else {
          // Якщо захід не знайдено, повертаємося до списку
          navigate('/management/measures');
        }
        setLoading(false);
        setHasLoaded(true);
      }
    };
    
    fetchMeasureDetails();
  }, [measureId, getMeasureDetails, navigate, hasLoaded]);

  const handleSubmit = async (
    measureData: Omit<Measure, 'id'>, 
    resources: { resource_id: number, quantity: number }[],
    legalDocs: { document_id: number }[]
  ) => {
    const success = await updateMeasure(measureId, measureData, resources, legalDocs);
    if (success) {
      navigate(`/management/measures/${measureId}`);
    }
  };

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

  return (
    <div className="container mx-auto py-8">
      <Button 
        variant="outline" 
        className="mb-6"
        onClick={() => navigate(`/management/measures/${measureId}`)}
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Назад до деталей
      </Button>
      
      <h1 className="text-3xl font-bold mb-6">Редагування заходу</h1>
      
      <MeasureForm
        initialData={{
          ...measure,
          resources: measure.resources?.map((r: any) => ({
            resource_id: r.resource.id,
            quantity: r.quantity
          })),
          legal_docs: measure.legal_documents?.map((d: any) => ({
            document_id: d.document.id
          }))
        }}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/management/measures/${measureId}`)}
      />
    </div>
  );
};

export default MeasureEdit;
