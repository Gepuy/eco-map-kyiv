
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Resource } from '@/types/managementTypes';
import { toast } from '@/components/ui/use-toast';

export const useResources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('resources')
          .select('*')
          .order('id');

        if (error) throw error;

        if (data) {
          setResources(data);
        }
      } catch (error) {
        console.error('Error fetching resources:', error);
        setError('Помилка при завантаженні ресурсів');
        toast({
          title: 'Помилка',
          description: 'Не вдалося завантажити дані про ресурси',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const addResource = async (resource: Omit<Resource, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .insert(resource)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setResources([...resources, data]);
        toast({
          title: 'Успішно',
          description: 'Ресурс успішно додано'
        });
        return data;
      }
    } catch (error) {
      console.error('Error adding resource:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося додати ресурс',
        variant: 'destructive'
      });
      return null;
    }
  };

  const updateResource = async (id: number, updates: Partial<Resource>) => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setResources(resources.map(res => res.id === id ? data : res));
        toast({
          title: 'Успішно',
          description: 'Ресурс успішно оновлено'
        });
        return true;
      }
    } catch (error) {
      console.error('Error updating resource:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося оновити ресурс',
        variant: 'destructive'
      });
      return false;
    }
  };

  const deleteResource = async (id: number) => {
    try {
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setResources(resources.filter(res => res.id !== id));
      toast({
        title: 'Успішно',
        description: 'Ресурс успішно видалено'
      });
      return true;
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося видалити ресурс. Можливо, він використовується в заходах.',
        variant: 'destructive'
      });
      return false;
    }
  };

  return { resources, loading, error, addResource, updateResource, deleteResource };
};
