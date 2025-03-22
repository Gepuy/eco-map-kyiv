
import { Facility } from "@/types/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import DetailedIndicatorsPanel from "./DetailedIndicatorsPanel";
import TrendChart from "./TrendChart";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, TrendingUp } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface FacilityCardProps {
  facility: Facility;
  isVisible: boolean;
}

const FacilityCard = ({ facility, isVisible }: FacilityCardProps) => {
  const [showDetailedIndicators, setShowDetailedIndicators] = useState(false);
  const [showTrendChart, setShowTrendChart] = useState(false);
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
      <CardHeader className="space-y-1">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-1 text-xs font-medium bg-eco-200 text-eco-800 rounded">
            {facility.type}
          </span>
        </div>
        <CardTitle className="text-xl font-semibold">{facility.name}</CardTitle>
        <CardDescription>{facility.address}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Вплив на довкілля</h4>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm">Повітря</span>
              <Progress value={facility.environmentalImpact.air * 10} className="w-32" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Вода</span>
              <Progress value={facility.environmentalImpact.water * 10} className="w-32" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Ґрунт</span>
              <Progress value={facility.environmentalImpact.soil * 10} className="w-32" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Системи моніторингу</h4>
          <div className="flex flex-wrap gap-1">
            {facility.monitoringSystems.map((system) => (
              <span
                key={system}
                className="px-2 py-1 text-xs bg-eco-100 text-eco-800 rounded"
              >
                {system}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Еко-енергоекономічні параметри</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">Енергоспоживання</p>
              <p className="font-medium">{facility.parameters.energyConsumption} МВт⋅год/рік</p>
            </div>
            <div>
              <p className="text-muted-foreground">Відходи</p>
              <p className="font-medium">{facility.parameters.wasteProduction} т/рік</p>
            </div>
            <div>
              <p className="text-muted-foreground">Викиди CO₂</p>
              <p className="font-medium">{facility.parameters.carbonEmissions} т/рік</p>
            </div>
            <div>
              <p className="text-muted-foreground">Використання води</p>
              <p className="font-medium">{facility.parameters.waterUsage} м³/рік</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-1">
            <TrendingUp className="h-4 w-4 text-eco-700" />
            Графік зміни показника
          </h4>
          <div className="space-y-2">
            <Select onValueChange={handleIndicatorSelect} defaultValue="air.dust">
              <SelectTrigger>
                <SelectValue placeholder="Оберіть показник" />
              </SelectTrigger>
              <SelectContent>
                {indicatorOptions.map((option) => (
                  <SelectItem key={`${option.type}.${option.name}`} value={`${option.type}.${option.name}`}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center" 
              onClick={() => setShowTrendChart(!showTrendChart)}
            >
              {showTrendChart ? (
                <>
                  <ChevronUp className="mr-2 h-4 w-4" />
                  Згорнути графік
                </>
              ) : (
                <>
                  <ChevronDown className="mr-2 h-4 w-4" />
                  Показати графік
                </>
              )}
            </Button>
          </div>
        </div>
        
        {showTrendChart && (
          <TrendChart 
            facility={facility} 
            indicatorType={selectedIndicator.type} 
            indicatorName={selectedIndicator.label}
          />
        )}

        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center" 
          onClick={() => setShowDetailedIndicators(!showDetailedIndicators)}
        >
          {showDetailedIndicators ? (
            <>
              <ChevronUp className="mr-2 h-4 w-4" />
              Згорнути детальні показники
            </>
          ) : (
            <>
              <ChevronDown className="mr-2 h-4 w-4" />
              Показати детальні показники
            </>
          )}
        </Button>

        {showDetailedIndicators && <DetailedIndicatorsPanel facility={facility} />}
      </CardContent>
    </Card>
  );
};

export default FacilityCard;
