
import { useState } from "react";
import Map from "@/components/Map";
import FacilityCard from "@/components/FacilityCard";
import { facilities, Facility } from "@/data/facilities";

const Index = () => {
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);

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
      </div>
    </div>
  );
};

export default Index;
