
import { useState, useEffect, useMemo } from "react";
import Map from "@/components/Map";
import FacilityCard from "@/components/FacilityCard";
import FilterPanel, { FilterOptions } from "@/components/FilterPanel";
import { Facility } from "@/types/supabase";
import { useFacilities } from "@/hooks/useFacilities";
import { filterFacilities } from "@/utils/dataUtils";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartBar, ListFilter, Filter } from "lucide-react";

const Index = () => {
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const { facilities, loading, error } = useFacilities();
  const [filters, setFilters] = useState<FilterOptions>({
    monitoringSystems: [],
    indicators: {
      air: true,
      water: true,
      soil: true,
      radiation: true,
      waste: true,
      economic: true,
      health: true,
      energy: true
    },
    indicatorThreshold: 0
  });
  
  // Отримуємо всі унікальні системи моніторингу з усіх об'єктів
  const availableMonitoringSystems = useMemo(() => {
    if (!facilities.length) return [];
    
    const allSystems = facilities.flatMap(facility => facility.monitoringSystems);
    return Array.from(new Set(allSystems));
  }, [facilities]);

  // Фільтрація об'єктів за обраними критеріями
  const filteredFacilities = useMemo(() => {
    return filterFacilities(
      facilities, 
      filters.monitoringSystems, 
      filters.indicators, 
      filters.indicatorThreshold
    );
  }, [facilities, filters]);

  // Скидаємо вибраний об'єкт, якщо він більше не відповідає фільтрам
  useEffect(() => {
    if (selectedFacility && !filteredFacilities.some(f => f.id === selectedFacility.id)) {
      setSelectedFacility(null);
    }
  }, [filteredFacilities, selectedFacility]);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-100 to-eco-200">
      <div className="container mx-auto p-4 lg:p-8">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl lg:text-4xl font-bold text-eco-900 mb-2">
            Екологічний моніторинг промислових об'єктів Києва
          </h1>
          <p className="text-eco-700 text-lg flex items-center justify-center gap-2">
            <Filter className="h-5 w-5" />
            Інтерактивна карта впливу на довкілля з фільтрацією та аналізом
            <ChartBar className="h-5 w-5" />
          </p>
        </div>

        {loading ? (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="w-full h-[120px] rounded-lg" />
              <Skeleton className="w-full h-[600px] rounded-lg" />
            </div>
            <div className="space-y-4">
              <Skeleton className="w-full h-[600px]" />
            </div>
          </div>
        ) : error ? (
          <div className="text-center p-8 bg-red-50 rounded-lg text-red-600">
            <p>{error}</p>
            <p className="mt-2">Будь ласка, спробуйте пізніше.</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4 animate-fade-in">
              <FilterPanel 
                availableMonitoringSystems={availableMonitoringSystems}
                onFilterChange={handleFilterChange}
              />
              
              <div className="h-[600px] rounded-lg overflow-hidden shadow-xl">
                <Map 
                  facilities={filteredFacilities} 
                  onFacilitySelect={setSelectedFacility} 
                />
              </div>
              
              <div className="flex justify-between items-center text-eco-700 text-sm">
                <p>Знайдено об'єктів: {filteredFacilities.length} з {facilities.length}</p>
                {filters.monitoringSystems.length > 0 && (
                  <p>Фільтр систем: {filters.monitoringSystems.join(', ')}</p>
                )}
              </div>
            </div>

            <div className="space-y-4 animate-slide-up">
              {selectedFacility ? (
                <FacilityCard
                  facility={selectedFacility}
                  isVisible={!!selectedFacility}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-eco-700 text-center">
                    Оберіть об'єкт на карті для перегляду детальної інформації
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
