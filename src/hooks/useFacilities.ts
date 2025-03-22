
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DatabaseFacility, Facility } from '@/types/supabase';
import { toast } from '@/components/ui/use-toast';

export const useFacilities = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('facilities')
          .select('*');

        if (error) throw error;

        if (data) {
          // Transform data to match our frontend schema
          const transformedData: Facility[] = data.map((item: DatabaseFacility) => ({
            id: item.id,
            name: item.name,
            type: item.type,
            location: item.location as [number, number],
            address: item.address,
            environmentalImpact: item.environmental_impact,
            monitoringSystems: item.monitoring_systems,
            parameters: item.parameters,
            detailedIndicators: item.detailed_indicators ? {
              air: {
                measured: {
                  dust: item.detailed_indicators.air?.measured?.dust || 0,
                  no2: item.detailed_indicators.air?.measured?.no2 || 0,
                  so2: item.detailed_indicators.air?.measured?.so2 || 0,
                  co: item.detailed_indicators.air?.measured?.co || 0,
                  formaldehyde: item.detailed_indicators.air?.measured?.formaldehyde || 0,
                  lead: item.detailed_indicators.air?.measured?.lead || 0,
                  benzopyrene: item.detailed_indicators.air?.measured?.benzopyrene || 0
                },
                calculated: {
                  air_quality_index: item.detailed_indicators.air?.calculated?.air_quality_index || 0
                }
              },
              water: {
                measured: {
                  microbiological: item.detailed_indicators.water?.measured?.microbiological || 0,
                  epidemiological: item.detailed_indicators.water?.measured?.epidemiological || 0,
                  organoleptic: item.detailed_indicators.water?.measured?.organoleptic || 0,
                  physicochemical: item.detailed_indicators.water?.measured?.physicochemical || 0,
                  sanitary_toxicological: item.detailed_indicators.water?.measured?.sanitary_toxicological || 0,
                  radiation: item.detailed_indicators.water?.measured?.radiation || 0
                },
                calculated: {
                  water_pollution_index: item.detailed_indicators.water?.calculated?.water_pollution_index || 0
                }
              },
              soil: {
                measured: {
                  humus: item.detailed_indicators.soil?.measured?.humus || 0,
                  phosphorus: item.detailed_indicators.soil?.measured?.phosphorus || 0,
                  potassium: item.detailed_indicators.soil?.measured?.potassium || 0,
                  salinity: item.detailed_indicators.soil?.measured?.salinity || 0,
                  solonetzicity: item.detailed_indicators.soil?.measured?.solonetzicity || 0,
                  chemical_pollution: item.detailed_indicators.soil?.measured?.chemical_pollution || 0,
                  ph: item.detailed_indicators.soil?.measured?.ph || 0
                },
                calculated: {
                  soil_bonitet: item.detailed_indicators.soil?.calculated?.soil_bonitet || 0
                }
              },
              radiation: {
                measured: {
                  short_half_life: item.detailed_indicators.radiation?.measured?.short_half_life || 0,
                  medium_half_life: item.detailed_indicators.radiation?.measured?.medium_half_life || 0,
                  air_radiation: item.detailed_indicators.radiation?.measured?.air_radiation || 0,
                  water_radiation: item.detailed_indicators.radiation?.measured?.water_radiation || 0
                },
                calculated: {
                  critical_event_probability: item.detailed_indicators.radiation?.calculated?.critical_event_probability || 0,
                  environmental_risk: item.detailed_indicators.radiation?.calculated?.environmental_risk || 0,
                  health_risk: item.detailed_indicators.radiation?.calculated?.health_risk || 0
                }
              },
              waste: {
                measured: {
                  hazard_class: item.detailed_indicators.waste?.measured?.hazard_class || 0,
                  toxicity: item.detailed_indicators.waste?.measured?.toxicity || 0,
                  volume: item.detailed_indicators.waste?.measured?.volume || 0
                },
                calculated: {
                  waste_management_level: item.detailed_indicators.waste?.calculated?.waste_management_level || 0
                }
              },
              economic: {
                measured: {
                  gross_product: item.detailed_indicators.economic?.measured?.gross_product || 0,
                  cargo_turnover: item.detailed_indicators.economic?.measured?.cargo_turnover || 0,
                  passenger_turnover: item.detailed_indicators.economic?.measured?.passenger_turnover || 0,
                  exports: item.detailed_indicators.economic?.measured?.exports || 0,
                  imports: item.detailed_indicators.economic?.measured?.imports || 0,
                  wages: item.detailed_indicators.economic?.measured?.wages || 0
                },
                calculated: {
                  industry_index: item.detailed_indicators.economic?.calculated?.industry_index || 0,
                  agriculture_index: item.detailed_indicators.economic?.calculated?.agriculture_index || 0,
                  construction_index: item.detailed_indicators.economic?.calculated?.construction_index || 0,
                  consumer_price_index: item.detailed_indicators.economic?.calculated?.consumer_price_index || 0,
                  producer_price_index: item.detailed_indicators.economic?.calculated?.producer_price_index || 0
                }
              },
              health: {
                measured: {
                  demographic: item.detailed_indicators.health?.measured?.demographic || 0,
                  disease_prevalence: item.detailed_indicators.health?.measured?.disease_prevalence || 0,
                  disability: item.detailed_indicators.health?.measured?.disability || 0,
                  physical_development: item.detailed_indicators.health?.measured?.physical_development || 0
                },
                calculated: {
                  disease_risk: item.detailed_indicators.health?.calculated?.disease_risk || 0,
                  disease_forecast: item.detailed_indicators.health?.calculated?.disease_forecast || 0,
                  life_expectancy: item.detailed_indicators.health?.calculated?.life_expectancy || 0
                }
              },
              energy: {
                measured: {
                  water_consumption: item.detailed_indicators.energy?.measured?.water_consumption || 0,
                  electricity_consumption: item.detailed_indicators.energy?.measured?.electricity_consumption || 0,
                  gas_consumption: item.detailed_indicators.energy?.measured?.gas_consumption || 0,
                  heat_consumption: item.detailed_indicators.energy?.measured?.heat_consumption || 0
                },
                calculated: {
                  energy_efficiency: item.detailed_indicators.energy?.calculated?.energy_efficiency || 0
                }
              }
            } : {
              air: { measured: {
                dust: 0, no2: 0, so2: 0, co: 0, formaldehyde: 0, lead: 0, benzopyrene: 0
              }, calculated: { air_quality_index: 0 } },
              water: { measured: {
                microbiological: 0, epidemiological: 0, organoleptic: 0, physicochemical: 0, 
                sanitary_toxicological: 0, radiation: 0
              }, calculated: { water_pollution_index: 0 } },
              soil: { measured: {
                humus: 0, phosphorus: 0, potassium: 0, salinity: 0, solonetzicity: 0, 
                chemical_pollution: 0, ph: 0
              }, calculated: { soil_bonitet: 0 } },
              radiation: { measured: {
                short_half_life: 0, medium_half_life: 0, air_radiation: 0, water_radiation: 0
              }, calculated: { 
                critical_event_probability: 0, environmental_risk: 0, health_risk: 0
              } },
              waste: { measured: {
                hazard_class: 0, toxicity: 0, volume: 0
              }, calculated: { waste_management_level: 0 } },
              economic: { measured: {
                gross_product: 0, cargo_turnover: 0, passenger_turnover: 0, exports: 0, imports: 0, wages: 0
              }, calculated: { 
                industry_index: 0, agriculture_index: 0, construction_index: 0, 
                consumer_price_index: 0, producer_price_index: 0
              } },
              health: { measured: {
                demographic: 0, disease_prevalence: 0, disability: 0, physical_development: 0
              }, calculated: { 
                disease_risk: 0, disease_forecast: 0, life_expectancy: 0
              } },
              energy: { measured: {
                water_consumption: 0, electricity_consumption: 0, gas_consumption: 0, heat_consumption: 0
              }, calculated: { energy_efficiency: 0 } }
            }
          }));
          
          // Для кожного об'єкта додаємо реалістичні дані для детальних індикаторів
          transformedData.forEach(facility => {
            // Повітря - визначаємо на основі environmentalImpact.air
            if (facility.environmentalImpact.air >= 7) {
              facility.detailedIndicators.air.measured.dust = 42.5 + Math.random() * 10;
              facility.detailedIndicators.air.measured.no2 = 0.12 + Math.random() * 0.05;
              facility.detailedIndicators.air.measured.so2 = 0.08 + Math.random() * 0.04;
              facility.detailedIndicators.air.measured.co = 3.8 + Math.random() * 1.2;
              facility.detailedIndicators.air.measured.formaldehyde = 0.009 + Math.random() * 0.003;
              facility.detailedIndicators.air.measured.lead = 0.0006 + Math.random() * 0.0002;
              facility.detailedIndicators.air.measured.benzopyrene = 0.0000015 + Math.random() * 0.0000005;
              facility.detailedIndicators.air.calculated.air_quality_index = 135 + Math.random() * 40;
            } else if (facility.environmentalImpact.air >= 5) {
              facility.detailedIndicators.air.measured.dust = 25.5 + Math.random() * 8;
              facility.detailedIndicators.air.measured.no2 = 0.08 + Math.random() * 0.04;
              facility.detailedIndicators.air.measured.so2 = 0.04 + Math.random() * 0.03;
              facility.detailedIndicators.air.measured.co = 2.5 + Math.random() * 0.8;
              facility.detailedIndicators.air.measured.formaldehyde = 0.005 + Math.random() * 0.002;
              facility.detailedIndicators.air.measured.lead = 0.0003 + Math.random() * 0.0001;
              facility.detailedIndicators.air.measured.benzopyrene = 0.0000008 + Math.random() * 0.0000003;
              facility.detailedIndicators.air.calculated.air_quality_index = 85 + Math.random() * 25;
            } else {
              facility.detailedIndicators.air.measured.dust = 12.5 + Math.random() * 5;
              facility.detailedIndicators.air.measured.no2 = 0.04 + Math.random() * 0.02;
              facility.detailedIndicators.air.measured.so2 = 0.02 + Math.random() * 0.01;
              facility.detailedIndicators.air.measured.co = 1.2 + Math.random() * 0.5;
              facility.detailedIndicators.air.measured.formaldehyde = 0.002 + Math.random() * 0.001;
              facility.detailedIndicators.air.measured.lead = 0.0001 + Math.random() * 0.00005;
              facility.detailedIndicators.air.measured.benzopyrene = 0.0000004 + Math.random() * 0.0000002;
              facility.detailedIndicators.air.calculated.air_quality_index = 45 + Math.random() * 15;
            }
            
            // Вода - визначаємо на основі environmentalImpact.water
            if (facility.environmentalImpact.water >= 7) {
              facility.detailedIndicators.water.measured.microbiological = 8.5 + Math.random() * 1.5;
              facility.detailedIndicators.water.measured.epidemiological = 7.8 + Math.random() * 1.2;
              facility.detailedIndicators.water.measured.organoleptic = 9.2 + Math.random() * 0.8;
              facility.detailedIndicators.water.measured.physicochemical = 8.7 + Math.random() * 1.3;
              facility.detailedIndicators.water.measured.sanitary_toxicological = 7.5 + Math.random() * 1.5;
              facility.detailedIndicators.water.measured.radiation = 2.2 + Math.random() * 0.8;
              facility.detailedIndicators.water.calculated.water_pollution_index = 4.2 + Math.random() * 0.8;
            } else if (facility.environmentalImpact.water >= 5) {
              facility.detailedIndicators.water.measured.microbiological = 6.2 + Math.random() * 1.2;
              facility.detailedIndicators.water.measured.epidemiological = 5.5 + Math.random() * 1.0;
              facility.detailedIndicators.water.measured.organoleptic = 7.1 + Math.random() * 0.9;
              facility.detailedIndicators.water.measured.physicochemical = 6.4 + Math.random() * 1.1;
              facility.detailedIndicators.water.measured.sanitary_toxicological = 5.8 + Math.random() * 1.2;
              facility.detailedIndicators.water.measured.radiation = 1.6 + Math.random() * 0.4;
              facility.detailedIndicators.water.calculated.water_pollution_index = 3.1 + Math.random() * 0.5;
            } else {
              facility.detailedIndicators.water.measured.microbiological = 3.8 + Math.random() * 1.0;
              facility.detailedIndicators.water.measured.epidemiological = 3.2 + Math.random() * 0.8;
              facility.detailedIndicators.water.measured.organoleptic = 4.5 + Math.random() * 0.7;
              facility.detailedIndicators.water.measured.physicochemical = 3.9 + Math.random() * 0.9;
              facility.detailedIndicators.water.measured.sanitary_toxicological = 3.6 + Math.random() * 0.8;
              facility.detailedIndicators.water.measured.radiation = 1.0 + Math.random() * 0.3;
              facility.detailedIndicators.water.calculated.water_pollution_index = 2.0 + Math.random() * 0.4;
            }
            
            // Ґрунт - визначаємо на основі environmentalImpact.soil
            if (facility.environmentalImpact.soil >= 5) {
              facility.detailedIndicators.soil.measured.humus = 3.2 + Math.random() * 0.8;
              facility.detailedIndicators.soil.measured.phosphorus = 12.5 + Math.random() * 3.5;
              facility.detailedIndicators.soil.measured.potassium = 11.2 + Math.random() * 3.0;
              facility.detailedIndicators.soil.measured.salinity = 1.2 + Math.random() * 0.5;
              facility.detailedIndicators.soil.measured.solonetzicity = 1.5 + Math.random() * 0.5;
              facility.detailedIndicators.soil.measured.chemical_pollution = 6.8 + Math.random() * 1.2;
              facility.detailedIndicators.soil.measured.ph = 5.2 + Math.random() * 0.8;
              facility.detailedIndicators.soil.calculated.soil_bonitet = 45 + Math.random() * 10;
            } else if (facility.environmentalImpact.soil >= 3) {
              facility.detailedIndicators.soil.measured.humus = 4.1 + Math.random() * 0.9;
              facility.detailedIndicators.soil.measured.phosphorus = 15.5 + Math.random() * 4.5;
              facility.detailedIndicators.soil.measured.potassium = 14.2 + Math.random() * 3.5;
              facility.detailedIndicators.soil.measured.salinity = 0.8 + Math.random() * 0.3;
              facility.detailedIndicators.soil.measured.solonetzicity = 1.0 + Math.random() * 0.3;
              facility.detailedIndicators.soil.measured.chemical_pollution = 4.2 + Math.random() * 0.8;
              facility.detailedIndicators.soil.measured.ph = 6.2 + Math.random() * 0.6;
              facility.detailedIndicators.soil.calculated.soil_bonitet = 62 + Math.random() * 8;
            } else {
              facility.detailedIndicators.soil.measured.humus = 5.0 + Math.random() * 1.0;
              facility.detailedIndicators.soil.measured.phosphorus = 18.5 + Math.random() * 5.5;
              facility.detailedIndicators.soil.measured.potassium = 16.8 + Math.random() * 4.2;
              facility.detailedIndicators.soil.measured.salinity = 0.5 + Math.random() * 0.2;
              facility.detailedIndicators.soil.measured.solonetzicity = 0.7 + Math.random() * 0.2;
              facility.detailedIndicators.soil.measured.chemical_pollution = 2.5 + Math.random() * 0.5;
              facility.detailedIndicators.soil.measured.ph = 6.8 + Math.random() * 0.4;
              facility.detailedIndicators.soil.calculated.soil_bonitet = 75 + Math.random() * 15;
            }
            
            // Типізуємо на основі типу об'єкта
            if (facility.type === 'Теплоелектроцентраль') {
              // Радіація
              facility.detailedIndicators.radiation.measured.short_half_life = 1.2 + Math.random() * 0.5;
              facility.detailedIndicators.radiation.measured.medium_half_life = 0.8 + Math.random() * 0.3;
              facility.detailedIndicators.radiation.measured.air_radiation = 16.2 + Math.random() * 3.0;
              facility.detailedIndicators.radiation.measured.water_radiation = 12.5 + Math.random() * 2.8;
              facility.detailedIndicators.radiation.calculated.critical_event_probability = 0.05 + Math.random() * 0.02;
              facility.detailedIndicators.radiation.calculated.environmental_risk = 3.2 + Math.random() * 0.5;
              facility.detailedIndicators.radiation.calculated.health_risk = 2.8 + Math.random() * 0.4;
              
              // Відходи
              facility.detailedIndicators.waste.measured.hazard_class = 2.8 + Math.random() * 0.4;
              facility.detailedIndicators.waste.measured.toxicity = 3.5 + Math.random() * 0.5;
              facility.detailedIndicators.waste.measured.volume = 8500 + Math.random() * 1500;
              facility.detailedIndicators.waste.calculated.waste_management_level = 6.5 + Math.random() * 1.0;
              
              // Енергія
              facility.detailedIndicators.energy.measured.water_consumption = 4200 + Math.random() * 800;
              facility.detailedIndicators.energy.measured.electricity_consumption = 650 + Math.random() * 150;
              facility.detailedIndicators.energy.measured.gas_consumption = 8500 + Math.random() * 1500;
              facility.detailedIndicators.energy.measured.heat_consumption = 950 + Math.random() * 150;
              facility.detailedIndicators.energy.calculated.energy_efficiency = 4.2 + Math.random() * 0.8;
            } else if (facility.type === 'Сміттєспалювальний завод') {
              // Радіація
              facility.detailedIndicators.radiation.measured.short_half_life = 0.8 + Math.random() * 0.3;
              facility.detailedIndicators.radiation.measured.medium_half_life = 0.5 + Math.random() * 0.2;
              facility.detailedIndicators.radiation.measured.air_radiation = 12.5 + Math.random() * 2.5;
              facility.detailedIndicators.radiation.measured.water_radiation = 9.8 + Math.random() * 2.2;
              facility.detailedIndicators.radiation.calculated.critical_event_probability = 0.03 + Math.random() * 0.015;
              facility.detailedIndicators.radiation.calculated.environmental_risk = 4.5 + Math.random() * 0.8;
              facility.detailedIndicators.radiation.calculated.health_risk = 3.8 + Math.random() * 0.6;
              
              // Відходи
              facility.detailedIndicators.waste.measured.hazard_class = 3.2 + Math.random() * 0.5;
              facility.detailedIndicators.waste.measured.toxicity = 4.5 + Math.random() * 0.8;
              facility.detailedIndicators.waste.measured.volume = 12500 + Math.random() * 2500;
              facility.detailedIndicators.waste.calculated.waste_management_level = 7.5 + Math.random() * 1.5;
              
              // Енергія
              facility.detailedIndicators.energy.measured.water_consumption = 3200 + Math.random() * 600;
              facility.detailedIndicators.energy.measured.electricity_consumption = 850 + Math.random() * 150;
              facility.detailedIndicators.energy.measured.gas_consumption = 2500 + Math.random() * 500;
              facility.detailedIndicators.energy.measured.heat_consumption = 750 + Math.random() * 150;
              facility.detailedIndicators.energy.calculated.energy_efficiency = 5.8 + Math.random() * 1.2;
            } else {
              // Радіація (низькі значення для нерадіаційних виробництв)
              facility.detailedIndicators.radiation.measured.short_half_life = 0.2 + Math.random() * 0.1;
              facility.detailedIndicators.radiation.measured.medium_half_life = 0.15 + Math.random() * 0.05;
              facility.detailedIndicators.radiation.measured.air_radiation = 8.5 + Math.random() * 1.5;
              facility.detailedIndicators.radiation.measured.water_radiation = 6.2 + Math.random() * 1.2;
              facility.detailedIndicators.radiation.calculated.critical_event_probability = 0.01 + Math.random() * 0.005;
              facility.detailedIndicators.radiation.calculated.environmental_risk = 1.5 + Math.random() * 0.3;
              facility.detailedIndicators.radiation.calculated.health_risk = 1.2 + Math.random() * 0.2;
              
              // Відходи
              facility.detailedIndicators.waste.measured.hazard_class = 1.8 + Math.random() * 0.3;
              facility.detailedIndicators.waste.measured.toxicity = 2.2 + Math.random() * 0.4;
              facility.detailedIndicators.waste.measured.volume = 2800 + Math.random() * 500;
              facility.detailedIndicators.waste.calculated.waste_management_level = 5.2 + Math.random() * 1.0;
              
              // Енергія
              facility.detailedIndicators.energy.measured.water_consumption = 1800 + Math.random() * 400;
              facility.detailedIndicators.energy.measured.electricity_consumption = 450 + Math.random() * 80;
              facility.detailedIndicators.energy.measured.gas_consumption = 1200 + Math.random() * 300;
              facility.detailedIndicators.energy.measured.heat_consumption = 350 + Math.random() * 70;
              facility.detailedIndicators.energy.calculated.energy_efficiency = 6.8 + Math.random() * 1.2;
            }
            
            // Економіка і здоров'я - генеруємо дані на основі ID об'єкта
            // Це забезпечить різноманітність даних
            facility.detailedIndicators.economic.measured.gross_product = 85000 + facility.id * 1200 + Math.random() * 5000;
            facility.detailedIndicators.economic.measured.cargo_turnover = 12500 + facility.id * 800 + Math.random() * 2500;
            facility.detailedIndicators.economic.measured.passenger_turnover = 8500 + facility.id * 500 + Math.random() * 1500;
            facility.detailedIndicators.economic.measured.exports = 35000 + facility.id * 1500 + Math.random() * 3000;
            facility.detailedIndicators.economic.measured.imports = 42000 + facility.id * 1800 + Math.random() * 4000;
            facility.detailedIndicators.economic.measured.wages = 15000 + facility.id * 350 + Math.random() * 1200;
            
            facility.detailedIndicators.economic.calculated.industry_index = 102.5 + facility.id * 0.8 + Math.random() * 3;
            facility.detailedIndicators.economic.calculated.agriculture_index = 98.2 + facility.id * 0.5 + Math.random() * 2;
            facility.detailedIndicators.economic.calculated.construction_index = 104.8 + facility.id * 1.2 + Math.random() * 4;
            facility.detailedIndicators.economic.calculated.consumer_price_index = 106.2 + facility.id * 0.7 + Math.random() * 3;
            facility.detailedIndicators.economic.calculated.producer_price_index = 107.5 + facility.id * 0.9 + Math.random() * 3.5;
            
            facility.detailedIndicators.health.measured.demographic = 68.5 + Math.random() * 5;
            facility.detailedIndicators.health.measured.disease_prevalence = 580 + facility.id * 20 + Math.random() * 50;
            facility.detailedIndicators.health.measured.disability = 58 + facility.id * 2 + Math.random() * 8;
            facility.detailedIndicators.health.measured.physical_development = 78.5 + Math.random() * 6;
            
            facility.detailedIndicators.health.calculated.disease_risk = 3.8 + Math.random() * 1.2;
            facility.detailedIndicators.health.calculated.disease_forecast = 4.2 + Math.random() * 1.5;
            facility.detailedIndicators.health.calculated.life_expectancy = 68.5 + Math.random() * 6;
          });
          
          setFacilities(transformedData);
        }
      } catch (error) {
        console.error('Error fetching facilities:', error);
        setError('Не вдалося завантажити дані про об\'єкти');
        toast({
          title: 'Помилка',
          description: 'Не вдалося завантажити дані про об\'єкти',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, []);

  return { facilities, loading, error };
};
