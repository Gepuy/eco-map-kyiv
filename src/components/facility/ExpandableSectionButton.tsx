
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExpandableSectionButtonProps {
  isExpanded: boolean;
  onToggle: () => void;
  labelCollapsed: string;
  labelExpanded: string;
  icon?: React.ReactNode;
}

const ExpandableSectionButton = ({
  isExpanded,
  onToggle,
  labelCollapsed,
  labelExpanded,
  icon
}: ExpandableSectionButtonProps) => {
  return (
    <Button 
      variant="outline" 
      className="w-full flex items-center justify-center" 
      onClick={onToggle}
    >
      {isExpanded ? (
        <>
          <ChevronUp className="mr-2 h-4 w-4" />
          {labelExpanded}
        </>
      ) : (
        <>
          <ChevronDown className="mr-2 h-4 w-4" />
          {icon && <span className="mr-2">{icon}</span>}
          {labelCollapsed}
        </>
      )}
    </Button>
  );
};

export default ExpandableSectionButton;
