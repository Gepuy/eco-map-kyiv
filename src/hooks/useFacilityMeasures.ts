
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ObjectMeasure, Measure, MeasureStatus } from '@/types/managementTypes';
import { toast } from '@/components/ui/use-toast';

export const useFacilityMeasures = (facilityId?: number) => {
  const [measures, setMeasures] = useState<ObjectMeasure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFacilityMeasures = async () => {
      if (!facilityId) {
        setMeasures([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('object_measures')
          .select(`
            *,
            measure:measures(*, category:categories(id, name, description))
          `)
          .eq('facility_id', facilityId)
          .order('priority');

        if (error) throw error;

        if (data) {
          setMeasures(data as ObjectMeasure[]);
        }
      } catch (error) {
        console.error('Error fetching facility measures:', error);
        setError('Помилка при завантаженні заходів');
        toast({
          title: 'Помилка',
          description: 'Не вдалося завантажити дані про заходи для об\'єкту',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFacilityMeasures();
  }, [facilityId]);

  const addFacilityMeasure = async (measure: Omit<ObjectMeasure, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('object_measures')
        .insert(measure)
        .select(`
          *,
          measure:measures(*, category:categories(id, name, description))
        `)
        .single();

      if (error) throw error;

      if (data) {
        setMeasures([...measures, data as ObjectMeasure]);
        toast({
          title: 'Успішно',
          description: 'Захід успішно додано для об\'єкту'
        });
        return data as ObjectMeasure;
      }
    } catch (error) {
      console.error('Error adding facility measure:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося додати захід для об\'єкту',
        variant: 'destructive'
      });
      return null;
    }
  };

  const updateFacilityMeasure = async (id: number, updates: Partial<ObjectMeasure>) => {
    try {
      const { data, error } = await supabase
        .from('object_measures')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          measure:measures(*, category:categories(id, name, description))
        `)
        .single();

      if (error) throw error;

      if (data) {
        setMeasures(measures.map(m => m.id === id ? data as ObjectMeasure : m));
        toast({
          title: 'Успішно',
          description: 'Статус заходу успішно оновлено'
        });
        return true;
      }
    } catch (error) {
      console.error('Error updating facility measure:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося оновити статус заходу',
        variant: 'destructive'
      });
      return false;
    }
  };

  const deleteFacilityMeasure = async (id: number) => {
    try {
      const { error } = await supabase
        .from('object_measures')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMeasures(measures.filter(m => m.id !== id));
      toast({
        title: 'Успішно',
        description: 'Захід успішно видалено'
      });
      return true;
    } catch (error) {
      console.error('Error deleting facility measure:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося видалити захід',
        variant: 'destructive'
      });
      return false;
    }
  };

  return { 
    measures, 
    loading, 
    error, 
    addFacilityMeasure, 
    updateFacilityMeasure, 
    deleteFacilityMeasure 
  };
};
