
import { Facility } from "@/types/supabase";

interface MonitoringSystemsSectionProps {
  facility: Facility;
}

const MonitoringSystemsSection = ({ facility }: MonitoringSystemsSectionProps) => {
  return (
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
  );
};

export default MonitoringSystemsSection;
