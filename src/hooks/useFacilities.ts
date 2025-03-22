
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
