
import { Facility } from "@/types/supabase";

interface ParametersSectionProps {
  facility: Facility;
}

const ParametersSection = ({ facility }: ParametersSectionProps) => {
  return (
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
  );
};

export default ParametersSection;
