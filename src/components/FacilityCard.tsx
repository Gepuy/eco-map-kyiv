
import { Facility } from "@/types/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface FacilityCardProps {
  facility: Facility;
  isVisible: boolean;
}

const FacilityCard = ({ facility, isVisible }: FacilityCardProps) => {
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
      </CardContent>
    </Card>
  );
};

export default FacilityCard;
