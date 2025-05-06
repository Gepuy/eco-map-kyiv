
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Measure, MeasureResource, MeasureLegalDoc } from '@/types/managementTypes';
import { toast } from '@/components/ui/use-toast';

export const useMeasures = (categoryId?: number) => {
  const [measures, setMeasures] = useState<Measure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMeasures = async () => {
      try {
        setLoading(true);
        let query = supabase
          .from('measures')
          .select(`
            *,
            category:categories(id, name)
          `)
          .order('id');
        
        if (categoryId) {
          query = query.eq('category_id', categoryId);
        }

        const { data, error } = await query;

        if (error) throw error;

        if (data) {
          setMeasures(data);
        }
      } catch (error) {
        console.error('Error fetching measures:', error);
        setError('Помилка при завантаженні заходів');
        toast({
          title: 'Помилка',
          description: 'Не вдалося завантажити дані про заходи',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMeasures();
  }, [categoryId]);

  const getMeasureDetails = async (id: number) => {
    try {
      const { data, error } = await supabase
        .from('measures')
        .select(`
          *,
          category:categories(id, name),
          resources:measure_resources(
            id, quantity,
            resource:resources(*)
          ),
          legal_documents:measure_legal_docs(
            id,
            document:legal_documents(*)
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error fetching measure details:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося завантажити деталі заходу',
        variant: 'destructive'
      });
      return null;
    }
  };

  const addMeasure = async (
    measure: Omit<Measure, 'id'>, 
    resources?: Omit<MeasureResource, 'id' | 'measure_id'>[],
    legalDocs?: { document_id: number }[]
  ) => {
    try {
      // Додаємо захід
      const { data: measureData, error: measureError } = await supabase
        .from('measures')
        .insert(measure)
        .select()
        .single();

      if (measureError) throw measureError;

      if (!measureData) {
        throw new Error('Не вдалося додати захід');
      }

      // Додаємо ресурси, якщо вони є
      if (resources && resources.length > 0) {
        const resourcesWithMeasureId = resources.map(resource => ({
          ...resource,
          measure_id: measureData.id
        }));

        const { error: resourcesError } = await supabase
          .from('measure_resources')
          .insert(resourcesWithMeasureId);

        if (resourcesError) throw resourcesError;
      }

      // Додаємо зв'язки з правовими документами, якщо вони є
      if (legalDocs && legalDocs.length > 0) {
        const docsWithMeasureId = legalDocs.map(doc => ({
          ...doc,
          measure_id: measureData.id
        }));

        const { error: docsError } = await supabase
          .from('measure_legal_docs')
          .insert(docsWithMeasureId);

        if (docsError) throw docsError;
      }

      toast({
        title: 'Успішно',
        description: 'Захід успішно додано'
      });
      
      // Оновлюємо стан
      setMeasures([...measures, {...measureData, category: null, resources: []}]);
      return measureData;

    } catch (error) {
      console.error('Error adding measure:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося додати захід',
        variant: 'destructive'
      });
      return null;
    }
  };

  const updateMeasure = async (
    id: number, 
    updates: Partial<Measure>,
    resources?: Omit<MeasureResource, 'id' | 'measure_id'>[],
    legalDocs?: { document_id: number }[]
  ) => {
    try {
      // Оновлюємо захід
      const { data: measureData, error: measureError } = await supabase
        .from('measures')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (measureError) throw measureError;

      if (!measureData) {
        throw new Error('Не вдалося оновити захід');
      }

      // Якщо вказані ресурси, видаляємо старі і додаємо нові
      if (resources) {
        // Видаляємо старі ресурси
        const { error: deleteError } = await supabase
          .from('measure_resources')
          .delete()
          .eq('measure_id', id);

        if (deleteError) throw deleteError;

        // Додаємо нові ресурси, якщо вони є
        if (resources.length > 0) {
          const resourcesWithMeasureId = resources.map(resource => ({
            ...resource,
            measure_id: id
          }));

          const { error: resourcesError } = await supabase
            .from('measure_resources')
            .insert(resourcesWithMeasureId);

          if (resourcesError) throw resourcesError;
        }
      }

      // Якщо вказані документи, видаляємо старі і додаємо нові
      if (legalDocs) {
        // Видаляємо старі зв'язки
        const { error: deleteDocsError } = await supabase
          .from('measure_legal_docs')
          .delete()
          .eq('measure_id', id);

        if (deleteDocsError) throw deleteDocsError;

        // Додаємо нові зв'язки, якщо вони є
        if (legalDocs.length > 0) {
          const docsWithMeasureId = legalDocs.map(doc => ({
            ...doc,
            measure_id: id
          }));

          const { error: docsError } = await supabase
            .from('measure_legal_docs')
            .insert(docsWithMeasureId);

          if (docsError) throw docsError;
        }
      }

      toast({
        title: 'Успішно',
        description: 'Захід успішно оновлено'
      });
      
      // Оновлюємо стан
      setMeasures(measures.map(m => m.id === id ? {...m, ...updates} : m));
      return true;

    } catch (error) {
      console.error('Error updating measure:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося оновити захід',
        variant: 'destructive'
      });
      return false;
    }
  };

  const deleteMeasure = async (id: number) => {
    try {
      const { error } = await supabase
        .from('measures')
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
      console.error('Error deleting measure:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося видалити захід. Можливо, він використовується в програмах або призначений об\'єктам.',
        variant: 'destructive'
      });
      return false;
    }
  };

  return { 
    measures, 
    loading, 
    error, 
    addMeasure, 
    updateMeasure, 
    deleteMeasure,
    getMeasureDetails 
  };
};
