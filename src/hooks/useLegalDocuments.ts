
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LegalDocument } from '@/types/managementTypes';
import { toast } from '@/components/ui/use-toast';

export const useLegalDocuments = () => {
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('legal_documents')
          .select('*')
          .order('date', { ascending: false });

        if (error) throw error;

        if (data) {
          setDocuments(data);
        }
      } catch (error) {
        console.error('Error fetching legal documents:', error);
        setError('Помилка при завантаженні документів');
        toast({
          title: 'Помилка',
          description: 'Не вдалося завантажити дані про законодавчі документи',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const addDocument = async (document: Omit<LegalDocument, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('legal_documents')
        .insert(document)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setDocuments([data, ...documents]);
        toast({
          title: 'Успішно',
          description: 'Документ успішно додано'
        });
        return data;
      }
    } catch (error) {
      console.error('Error adding document:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося додати документ',
        variant: 'destructive'
      });
      return null;
    }
  };

  const updateDocument = async (id: number, updates: Partial<LegalDocument>) => {
    try {
      const { data, error } = await supabase
        .from('legal_documents')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setDocuments(documents.map(doc => doc.id === id ? data : doc));
        toast({
          title: 'Успішно',
          description: 'Документ успішно оновлено'
        });
        return true;
      }
    } catch (error) {
      console.error('Error updating document:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося оновити документ',
        variant: 'destructive'
      });
      return false;
    }
  };

  const deleteDocument = async (id: number) => {
    try {
      const { error } = await supabase
        .from('legal_documents')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setDocuments(documents.filter(doc => doc.id !== id));
      toast({
        title: 'Успішно',
        description: 'Документ успішно видалено'
      });
      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося видалити документ. Можливо, він пов\'язаний із заходами.',
        variant: 'destructive'
      });
      return false;
    }
  };

  return { documents, loading, error, addDocument, updateDocument, deleteDocument };
};
