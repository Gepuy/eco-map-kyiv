
import { useState } from "react";
import { Facility } from "@/types/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart4 } from "lucide-react";
import FacilityHeader from "./facility/FacilityHeader";
import EnvironmentalImpactSection from "./facility/EnvironmentalImpactSection";
import MonitoringSystemsSection from "./facility/MonitoringSystemsSection";
import ParametersSection from "./facility/ParametersSection";
import ExpandableSectionButton from "./facility/ExpandableSectionButton";
import DetailedIndicatorsPanel from "./DetailedIndicatorsPanel";
import IntegratedIndicatorsPanel from "./IntegratedIndicatorsPanel";
import TrendChartSection from "./facility/TrendChartSection";

interface FacilityCardProps {
  facility: Facility;
  isVisible: boolean;
}

const FacilityCard = ({ facility, isVisible }: FacilityCardProps) => {
  const [showDetailedIndicators, setShowDetailedIndicators] = useState(false);
  const [showIntegratedIndicators, setShowIntegratedIndicators] = useState(false);
  const [selectedIndicator, setSelectedIndicator] = useState<{
    type: string,
    name: string,
    label: string
  }>({
    type: 'air',
    name: 'dust',
    label: 'Пил'
  });

  const indicatorOptions = [
    { type: 'air', name: 'dust', label: 'Пил' },
    { type: 'air', name: 'no2', label: 'NO2' },
    { type: 'air', name: 'so2', label: 'SO2' },
    { type: 'water', name: 'microbiological', label: 'Мікробіологічні показники' },
    { type: 'water', name: 'epidemiological', label: 'Епідеміологічні показники' },
    { type: 'soil', name: 'humus', label: 'Гумус' },
    { type: 'soil', name: 'phosphorus', label: 'Фосфор' },
    { type: 'radiation', name: 'air_radiation', label: 'Радіація повітря' },
    { type: 'radiation', name: 'water_radiation', label: 'Радіація води' },
    { type: 'waste', name: 'volume', label: 'Об\'єм відходів' },
    { type: 'economic', name: 'gross_product', label: 'ВВП' },
    { type: 'health', name: 'disease_prevalence', label: 'Захворюваність' },
    { type: 'energy', name: 'electricity_consumption', label: 'Споживання електроенергії' }
  ];

  const handleIndicatorSelect = (value: string) => {
    const [type, name] = value.split('.');
    const option = indicatorOptions.find(opt => opt.type === type && opt.name === name);
    if (option) {
      console.log("Selected indicator:", option);
      setSelectedIndicator(option);
    }
  };

  return (
    <Card
      className={`w-full max-w-md bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-300 ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <FacilityHeader facility={facility} />
      
      <CardContent className="space-y-4">
        <EnvironmentalImpactSection facility={facility} />
        <MonitoringSystemsSection facility={facility} />
        <ParametersSection facility={facility} />

        <ExpandableSectionButton 
          isExpanded={showIntegratedIndicators}
          onToggle={() => setShowIntegratedIndicators(!showIntegratedIndicators)}
          labelCollapsed="Показати інтегральні показники"
          labelExpanded="Згорнути інтегральні показники"
          icon={<BarChart4 className="h-4 w-4" />}
        />

        {showIntegratedIndicators && <IntegratedIndicatorsPanel facility={facility} />}
        
        <TrendChartSection 
          facility={facility}
          indicatorOptions={indicatorOptions}
          selectedIndicator={selectedIndicator}
          onIndicatorSelect={handleIndicatorSelect}
        />

        <ExpandableSectionButton 
          isExpanded={showDetailedIndicators}
          onToggle={() => setShowDetailedIndicators(!showDetailedIndicators)}
          labelCollapsed="Показати детальні показники"
          labelExpanded="Згорнути детальні показники"
        />

        {showDetailedIndicators && <DetailedIndicatorsPanel facility={facility} />}
      </CardContent>
    </Card>
  );
};

export default FacilityCard;
