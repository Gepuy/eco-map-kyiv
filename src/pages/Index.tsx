
import { useState } from "react";
import Map from "@/components/Map";
import FacilityCard from "@/components/FacilityCard";
import { Facility } from "@/types/supabase";
import { useFacilities } from "@/hooks/useFacilities";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const { facilities, loading, error } = useFacilities();

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-100 to-eco-200">
      <div className="container mx-auto p-4 lg:p-8">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl lg:text-4xl font-bold text-eco-900 mb-2">
            Екологічний моніторинг промислових об'єктів Києва
          </h1>
          <p className="text-eco-700 text-lg">
            Інтерактивна карта впливу на довкілля та енергоефективності
          </p>
        </div>

        {loading ? (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-[600px] rounded-lg overflow-hidden shadow-xl">
              <Skeleton className="w-full h-full" />
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
            <div className="lg:col-span-2 h-[600px] rounded-lg overflow-hidden shadow-xl animate-fade-in">
              <Map facilities={facilities} onFacilitySelect={setSelectedFacility} />
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
