
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
  detailed_indicators: {
    air: {
      measured: {
        dust: number;
        no2: number;
        so2: number;
        co: number;
        formaldehyde: number;
        lead: number;
        benzopyrene: number;
      };
      calculated: {
        air_quality_index: number;
      };
    };
    water: {
      measured: {
        microbiological: number;
        epidemiological: number;
        organoleptic: number;
        physicochemical: number;
        sanitary_toxicological: number;
        radiation: number;
      };
      calculated: {
        water_pollution_index: number;
      };
    };
    soil: {
      measured: {
        humus: number;
        phosphorus: number;
        potassium: number;
        salinity: number;
        solonetzicity: number;
        chemical_pollution: number;
        ph: number;
      };
      calculated: {
        soil_bonitet: number;
      };
    };
    radiation: {
      measured: {
        short_half_life: number;
        medium_half_life: number;
        air_radiation: number;
        water_radiation: number;
      };
      calculated: {
        critical_event_probability: number;
        environmental_risk: number;
        health_risk: number;
      };
    };
    waste: {
      measured: {
        hazard_class: number;
        toxicity: number;
        volume: number;
      };
      calculated: {
        waste_management_level: number;
      };
    };
    economic: {
      measured: {
        gross_product: number;
        cargo_turnover: number;
        passenger_turnover: number;
        exports: number;
        imports: number;
        wages: number;
      };
      calculated: {
        industry_index: number;
        agriculture_index: number;
        construction_index: number;
        consumer_price_index: number;
        producer_price_index: number;
      };
    };
    health: {
      measured: {
        demographic: number;
        disease_prevalence: number;
        disability: number;
        physical_development: number;
      };
      calculated: {
        disease_risk: number;
        disease_forecast: number;
        life_expectancy: number;
      };
    };
    energy: {
      measured: {
        water_consumption: number;
        electricity_consumption: number;
        gas_consumption: number;
        heat_consumption: number;
      };
      calculated: {
        energy_efficiency: number;
      };
    };
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
  detailedIndicators: {
    air: {
      measured: {
        dust: number;
        no2: number;
        so2: number;
        co: number;
        formaldehyde: number;
        lead: number;
        benzopyrene: number;
      };
      calculated: {
        air_quality_index: number;
      };
    };
    water: {
      measured: {
        microbiological: number;
        epidemiological: number;
        organoleptic: number;
        physicochemical: number;
        sanitary_toxicological: number;
        radiation: number;
      };
      calculated: {
        water_pollution_index: number;
      };
    };
    soil: {
      measured: {
        humus: number;
        phosphorus: number;
        potassium: number;
        salinity: number;
        solonetzicity: number;
        chemical_pollution: number;
        ph: number;
      };
      calculated: {
        soil_bonitet: number;
      };
    };
    radiation: {
      measured: {
        short_half_life: number;
        medium_half_life: number;
        air_radiation: number;
        water_radiation: number;
      };
      calculated: {
        critical_event_probability: number;
        environmental_risk: number;
        health_risk: number;
      };
    };
    waste: {
      measured: {
        hazard_class: number;
        toxicity: number;
        volume: number;
      };
      calculated: {
        waste_management_level: number;
      };
    };
    economic: {
      measured: {
        gross_product: number;
        cargo_turnover: number;
        passenger_turnover: number;
        exports: number;
        imports: number;
        wages: number;
      };
      calculated: {
        industry_index: number;
        agriculture_index: number;
        construction_index: number;
        consumer_price_index: number;
        producer_price_index: number;
      };
    };
    health: {
      measured: {
        demographic: number;
        disease_prevalence: number;
        disability: number;
        physical_development: number;
      };
      calculated: {
        disease_risk: number;
        disease_forecast: number;
        life_expectancy: number;
      };
    };
    energy: {
      measured: {
        water_consumption: number;
        electricity_consumption: number;
        gas_consumption: number;
        heat_consumption: number;
      };
      calculated: {
        energy_efficiency: number;
      };
    };
  };
}
