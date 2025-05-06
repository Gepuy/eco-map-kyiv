
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RegionalProgram, ProgramMeasure, ProgramReport, CategoryStatistics } from '@/types/managementTypes';
import { toast } from '@/components/ui/use-toast';

export const useRegionalPrograms = () => {
  const [programs, setPrograms] = useState<RegionalProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('regional_programs')
          .select('*')
          .order('start_date', { ascending: false });

        if (error) throw error;

        if (data) {
          setPrograms(data);
        }
      } catch (error) {
        console.error('Error fetching regional programs:', error);
        setError('Помилка при завантаженні програм');
        toast({
          title: 'Помилка',
          description: 'Не вдалося завантажити дані про регіональні програми',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  const getProgramDetails = async (id: number): Promise<ProgramReport | null> => {
    try {
      // Отримуємо дані про програму
      const { data: programData, error: programError } = await supabase
        .from('regional_programs')
        .select('*')
        .eq('id', id)
        .single();

      if (programError) throw programError;

      // Отримуємо дані про заходи в програмі
      const { data: measuresData, error: measuresError } = await supabase
        .from('program_measures')
        .select(`
          *,
          measure:measures(*, category:categories(id, name))
        `)
        .eq('program_id', id)
        .order('year');

      if (measuresError) throw measuresError;

      if (programData && measuresData) {
        // Групуємо заходи по рокам
        const years = Array.from(new Set(measuresData.map(m => m.year))).sort();
        const measuresByYear: Record<number, ProgramMeasure[]> = {};
        const totalByYear: Record<number, number> = {};
        
        years.forEach(year => {
          measuresByYear[year] = measuresData.filter(m => m.year === year);
          totalByYear[year] = measuresByYear[year].reduce((acc, m) => acc + m.planned_funding, 0);
        });

        // Збираємо статистику по категоріям
        const categoriesMap = new Map<number, {
          categoryId: number,
          categoryName: string,
          count: number,
          funding: number
        }>();

        measuresData.forEach(m => {
          if (m.measure?.category) {
            const categoryId = m.measure.category.id;
            const categoryName = m.measure.category.name;
            
            if (!categoriesMap.has(categoryId)) {
              categoriesMap.set(categoryId, {
                categoryId,
                categoryName,
                count: 0,
                funding: 0
              });
            }
            
            const category = categoriesMap.get(categoryId)!;
            category.count++;
            category.funding += m.planned_funding;
          }
        });

        const totalFunding = Object.values(totalByYear).reduce((acc, val) => acc + val, 0);
        const categoriesDistribution = Array.from(categoriesMap.values())
          .map(category => ({
            ...category,
            percentage: totalFunding > 0 ? (category.funding / totalFunding) * 100 : 0
          }))
          .sort((a, b) => b.funding - a.funding);

        const report: ProgramReport = {
          program: programData,
          years,
          totalBudget: programData.budget,
          measuresCount: measuresData.length,
          measuresByYear,
          totalByYear,
          categoriesDistribution
        };

        return report;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching program details:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося завантажити деталі програми',
        variant: 'destructive'
      });
      return null;
    }
  };

  const addProgram = async (
    program: Omit<RegionalProgram, 'id'>,
    measures?: { measure_id: number, year: number, planned_funding: number }[]
  ) => {
    try {
      // Додаємо програму
      const { data: programData, error: programError } = await supabase
        .from('regional_programs')
        .insert(program)
        .select()
        .single();

      if (programError) throw programError;

      if (!programData) {
        throw new Error('Не вдалося додати програму');
      }

      // Додаємо заходи, якщо вони є
      if (measures && measures.length > 0) {
        const measuresWithProgramId = measures.map(measure => ({
          ...measure,
          program_id: programData.id
        }));

        const { error: measuresError } = await supabase
          .from('program_measures')
          .insert(measuresWithProgramId);

        if (measuresError) throw measuresError;
      }

      toast({
        title: 'Успішно',
        description: 'Програму успішно додано'
      });
      
      // Оновлюємо стан
      setPrograms([programData, ...programs]);
      return programData;

    } catch (error) {
      console.error('Error adding program:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося додати програму',
        variant: 'destructive'
      });
      return null;
    }
  };

  const updateProgram = async (
    id: number,
    updates: Partial<RegionalProgram>,
    measures?: { measure_id: number, year: number, planned_funding: number }[]
  ) => {
    try {
      // Оновлюємо програму
      const { data: programData, error: programError } = await supabase
        .from('regional_programs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (programError) throw programError;

      if (!programData) {
        throw new Error('Не вдалося оновити програму');
      }

      // Якщо вказані заходи, видаляємо старі і додаємо нові
      if (measures !== undefined) {
        // Видаляємо старі заходи
        const { error: deleteError } = await supabase
          .from('program_measures')
          .delete()
          .eq('program_id', id);

        if (deleteError) throw deleteError;

        // Додаємо нові заходи, якщо вони є
        if (measures.length > 0) {
          const measuresWithProgramId = measures.map(measure => ({
            ...measure,
            program_id: id
          }));

          const { error: measuresError } = await supabase
            .from('program_measures')
            .insert(measuresWithProgramId);

          if (measuresError) throw measuresError;
        }
      }

      toast({
        title: 'Успішно',
        description: 'Програму успішно оновлено'
      });
      
      // Оновлюємо стан
      setPrograms(programs.map(p => p.id === id ? programData : p));
      return true;

    } catch (error) {
      console.error('Error updating program:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося оновити програму',
        variant: 'destructive'
      });
      return false;
    }
  };

  const deleteProgram = async (id: number) => {
    try {
      const { error } = await supabase
        .from('regional_programs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPrograms(programs.filter(p => p.id !== id));
      toast({
        title: 'Успішно',
        description: 'Програму успішно видалено'
      });
      return true;
    } catch (error) {
      console.error('Error deleting program:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося видалити програму',
        variant: 'destructive'
      });
      return false;
    }
  };

  const getCategoriesStatistics = async (): Promise<CategoryStatistics[]> => {
    try {
      // Використовуємо SQL запит через суперджсон-оператор для агрегації даних
      const { data, error } = await supabase.rpc('get_category_statistics');

      if (error) throw error;

      if (!data) {
        return [];
      }

      return data;
    } catch (error) {
      console.error('Error getting categories statistics:', error);
      toast({
        title: 'Помилка',
        description: 'Не вдалося отримати статистику категорій',
        variant: 'destructive'
      });
      return [];
    }
  };

  return { 
    programs, 
    loading, 
    error, 
    addProgram, 
    updateProgram, 
    deleteProgram,
    getProgramDetails,
    getCategoriesStatistics
  };
};
