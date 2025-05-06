
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Category } from '@/types/managementTypes';
import { toast } from '@/components/ui/use-toast';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('id');

        if (error) throw error;

        if (data) {
          setCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Помилка при завантаженні категорій');
        toast({
          title: 'Помилка',
          description: 'Не вдалося завантажити дані про категорії',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const addCategory = async (category: Omit<Category, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert(category)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setCategories([...categories, data]);
        toast({
          title: 'Успішно',
          description: 'Категорію успішно додано'
        });
        return data;
      }
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося додати категорію',
        variant: 'destructive'
      });
      return null;
    }
  };

  const updateCategory = async (id: number, updates: Partial<Category>) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setCategories(categories.map(cat => cat.id === id ? data : cat));
        toast({
          title: 'Успішно',
          description: 'Категорію успішно оновлено'
        });
        return true;
      }
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося оновити категорію',
        variant: 'destructive'
      });
      return false;
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCategories(categories.filter(cat => cat.id !== id));
      toast({
        title: 'Успішно',
        description: 'Категорію успішно видалено'
      });
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося видалити категорію. Можливо, вона використовується в заходах.',
        variant: 'destructive'
      });
      return false;
    }
  };

  return { categories, loading, error, addCategory, updateCategory, deleteCategory };
};
