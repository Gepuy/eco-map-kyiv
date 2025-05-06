
import { Facility } from "@/types/supabase";
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface FacilityHeaderProps {
  facility: Facility;
}

const FacilityHeader = ({ facility }: FacilityHeaderProps) => {
  return (
    <CardHeader className="space-y-1">
      <div className="flex items-center space-x-2">
        <span className="px-2 py-1 text-xs font-medium bg-eco-200 text-eco-800 rounded">
          {facility.type}
        </span>
      </div>
      <CardTitle className="text-xl font-semibold">{facility.name}</CardTitle>
      <CardDescription>{facility.address}</CardDescription>
    </CardHeader>
  );
};

export default FacilityHeader;
