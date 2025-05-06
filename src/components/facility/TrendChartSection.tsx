
import { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { Facility } from "@/types/supabase";
import TrendChart from "@/components/TrendChart";
import ExpandableSectionButton from './ExpandableSectionButton';
import IndicatorSelector from './IndicatorSelector';

interface IndicatorOption {
  type: string;
  name: string;
  label: string;
}

interface TrendChartSectionProps {
  facility: Facility;
  indicatorOptions: IndicatorOption[];
  selectedIndicator: IndicatorOption;
  onIndicatorSelect: (value: string) => void;
}

const TrendChartSection = ({
  facility,
  indicatorOptions,
  selectedIndicator,
  onIndicatorSelect
}: TrendChartSectionProps) => {
  const [showTrendChart, setShowTrendChart] = useState(false);

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium flex items-center gap-1">
        <TrendingUp className="h-4 w-4 text-eco-700" />
        Графік зміни показника
      </h4>
      <div className="space-y-2">
        <IndicatorSelector 
          options={indicatorOptions} 
          selectedValue={`${selectedIndicator.type}.${selectedIndicator.name}`}
          onSelect={onIndicatorSelect}
        />
        
        <ExpandableSectionButton
          isExpanded={showTrendChart}
          onToggle={() => setShowTrendChart(!showTrendChart)}
          labelCollapsed="Показати графік"
          labelExpanded="Згорнути графік"
        />
      </div>
      
      {showTrendChart && (
        <TrendChart 
          facility={facility} 
          indicatorType={selectedIndicator.type} 
          indicatorName={selectedIndicator.label}
        />
      )}
    </div>
  );
};

export default TrendChartSection;
