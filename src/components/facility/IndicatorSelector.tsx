
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface IndicatorOption {
  type: string;
  name: string;
  label: string;
}

interface IndicatorSelectorProps {
  options: IndicatorOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

const IndicatorSelector = ({ options, selectedValue, onSelect }: IndicatorSelectorProps) => {
  return (
    <Select onValueChange={onSelect} defaultValue={selectedValue}>
      <SelectTrigger>
        <SelectValue placeholder="Оберіть показник" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={`${option.type}.${option.name}`} value={`${option.type}.${option.name}`}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default IndicatorSelector;
