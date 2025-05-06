
import { Facility } from "@/types/supabase";
import { Progress } from "@/components/ui/progress";

interface EnvironmentalImpactSectionProps {
  facility: Facility;
}

const EnvironmentalImpactSection = ({ facility }: EnvironmentalImpactSectionProps) => {
  return (
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
  );
};

export default EnvironmentalImpactSection;
