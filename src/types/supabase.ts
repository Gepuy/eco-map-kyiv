
export interface DatabaseFacility {
  id: number;
  name: string;
  type: string;
  location: [number, number];
  address: string;
  environmental_impact: {
    air: number;
    water: number;
    soil: number;
  };
  monitoring_systems: string[];
  parameters: {
    energyConsumption: number;
    wasteProduction: number;
    carbonEmissions: number;
    waterUsage: number;
  };
}

export type Facility = {
  id: number;
  name: string;
  type: string;
  location: [number, number];
  address: string;
  environmentalImpact: {
    air: number;
    water: number;
    soil: number;
  };
  monitoringSystems: string[];
  parameters: {
    energyConsumption: number;
    wasteProduction: number;
    carbonEmissions: number;
    waterUsage: number;
  };
}
