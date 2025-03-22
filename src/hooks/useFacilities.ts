
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DatabaseFacility, Facility } from '@/types/supabase';
import { toast } from '@/components/ui/use-toast';

export const useFacilities = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('facilities')
          .select('*');

        if (error) throw error;

        if (data) {
          // Transform data to match our frontend schema
          const transformedData: Facility[] = data.map((item: DatabaseFacility) => ({
            id: item.id,
            name: item.name,
            type: item.type,
            location: item.location as [number, number],
            address: item.address,
            environmentalImpact: item.environmental_impact,
            monitoringSystems: item.monitoring_systems,
            parameters: item.parameters,
            detailedIndicators: item.detailed_indicators || {
              air: { measured: {}, calculated: {} },
              water: { measured: {}, calculated: {} },
              soil: { measured: {}, calculated: {} },
              radiation: { measured: {}, calculated: {} },
              waste: { measured: {}, calculated: {} },
              economic: { measured: {}, calculated: {} },
              health: { measured: {}, calculated: {} },
              energy: { measured: {}, calculated: {} }
            }
          }));
          
          setFacilities(transformedData);
        }
      } catch (error) {
        console.error('Error fetching facilities:', error);
        setError('Не вдалося завантажити дані про об\'єкти');
        toast({
          title: 'Помилка',
          description: 'Не вдалося завантажити дані про об\'єкти',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, []);

  return { facilities, loading, error };
};
