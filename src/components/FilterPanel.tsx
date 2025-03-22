
import { useState } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Filter, ListFilter } from 'lucide-react';

export type FilterOptions = {
  monitoringSystems: string[];
  indicators: {
    air: boolean;
    water: boolean;
    soil: boolean;
    radiation: boolean;
    waste: boolean;
    economic: boolean;
    health: boolean;
    energy: boolean;
  };
  indicatorThreshold: number;
};

interface FilterPanelProps {
  availableMonitoringSystems: string[];
  onFilterChange: (filters: FilterOptions) => void;
}

const FilterPanel = ({ availableMonitoringSystems, onFilterChange }: FilterPanelProps) => {
  const [filters, setFilters] = useState<FilterOptions>({
    monitoringSystems: [],
    indicators: {
      air: true,
      water: true,
      soil: true,
      radiation: true,
      waste: true,
      economic: true,
      health: true,
      energy: true
    },
    indicatorThreshold: 5
  });

  const handleMonitoringSystemChange = (value: string) => {
    let newSystems: string[];

    if (value === "all") {
      newSystems = [...availableMonitoringSystems];
    } else if (value === "none") {
      newSystems = [];
    } else {
      newSystems = [value];
    }

    const updatedFilters = {
      ...filters,
      monitoringSystems: newSystems
    };
    
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleIndicatorChange = (indicator: keyof FilterOptions['indicators'], checked: boolean) => {
    const updatedFilters = {
      ...filters,
      indicators: {
        ...filters.indicators,
        [indicator]: checked
      }
    };
    
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleThresholdChange = (value: string) => {
    const threshold = parseInt(value, 10);
    const updatedFilters = {
      ...filters,
      indicatorThreshold: threshold
    };
    
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-lg p-4 mb-4">
      <div className="flex items-center gap-2 mb-4">
        <ListFilter className="h-5 w-5 text-eco-700" />
        <h3 className="font-semibold text-lg">Фільтри</h3>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="monitoring-system">Підсистема моніторингу</Label>
          <Select onValueChange={handleMonitoringSystemChange} defaultValue="all">
            <SelectTrigger id="monitoring-system">
              <SelectValue placeholder="Оберіть підсистему" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Всі підсистеми</SelectItem>
              <SelectItem value="none">Жодної</SelectItem>
              {availableMonitoringSystems.map((system) => (
                <SelectItem key={system} value={system}>
                  {system}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="threshold">Мінімальний поріг забруднення</Label>
          <Select onValueChange={handleThresholdChange} defaultValue="5">
            <SelectTrigger id="threshold">
              <SelectValue placeholder="Оберіть поріг" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Будь-який рівень</SelectItem>
              <SelectItem value="3">Середній (3+)</SelectItem>
              <SelectItem value="5">Високий (5+)</SelectItem>
              <SelectItem value="7">Дуже високий (7+)</SelectItem>
              <SelectItem value="9">Критичний (9+)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="block mb-2">Показники</Label>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="air" 
                checked={filters.indicators.air}
                onCheckedChange={(checked) => 
                  handleIndicatorChange('air', checked as boolean)
                }
              />
              <Label htmlFor="air">Повітря</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="water" 
                checked={filters.indicators.water}
                onCheckedChange={(checked) => 
                  handleIndicatorChange('water', checked as boolean)
                }
              />
              <Label htmlFor="water">Вода</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="soil" 
                checked={filters.indicators.soil}
                onCheckedChange={(checked) => 
                  handleIndicatorChange('soil', checked as boolean)
                }
              />
              <Label htmlFor="soil">Ґрунт</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="radiation" 
                checked={filters.indicators.radiation}
                onCheckedChange={(checked) => 
                  handleIndicatorChange('radiation', checked as boolean)
                }
              />
              <Label htmlFor="radiation">Радіація</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="waste" 
                checked={filters.indicators.waste}
                onCheckedChange={(checked) => 
                  handleIndicatorChange('waste', checked as boolean)
                }
              />
              <Label htmlFor="waste">Відходи</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="economic" 
                checked={filters.indicators.economic}
                onCheckedChange={(checked) => 
                  handleIndicatorChange('economic', checked as boolean)
                }
              />
              <Label htmlFor="economic">Економіка</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="health" 
                checked={filters.indicators.health}
                onCheckedChange={(checked) => 
                  handleIndicatorChange('health', checked as boolean)
                }
              />
              <Label htmlFor="health">Здоров'я</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="energy" 
                checked={filters.indicators.energy}
                onCheckedChange={(checked) => 
                  handleIndicatorChange('energy', checked as boolean)
                }
              />
              <Label htmlFor="energy">Енергетика</Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
