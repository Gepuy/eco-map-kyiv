
import { Facility } from '@/types/supabase';

// Функція для отримання значення індикатора за шляхом
const getIndicatorValue = (facility: Facility, type: string, name: string): number => {
  try {
    // @ts-ignore - Використовуємо динамічний доступ до властивостей
    if (type === 'air' && facility.detailedIndicators.air.measured[name]) {
      // @ts-ignore
      return facility.detailedIndicators.air.measured[name];
    }
    if (type === 'water' && facility.detailedIndicators.water.measured[name]) {
      // @ts-ignore
      return facility.detailedIndicators.water.measured[name];
    }
    if (type === 'soil' && facility.detailedIndicators.soil.measured[name]) {
      // @ts-ignore
      return facility.detailedIndicators.soil.measured[name];
    }
    if (type === 'radiation' && facility.detailedIndicators.radiation.measured[name]) {
      // @ts-ignore
      return facility.detailedIndicators.radiation.measured[name];
    }
    if (type === 'waste' && facility.detailedIndicators.waste.measured[name]) {
      // @ts-ignore
      return facility.detailedIndicators.waste.measured[name];
    }
    if (type === 'economic' && facility.detailedIndicators.economic.measured[name]) {
      // @ts-ignore
      return facility.detailedIndicators.economic.measured[name];
    }
    if (type === 'health' && facility.detailedIndicators.health.measured[name]) {
      // @ts-ignore
      return facility.detailedIndicators.health.measured[name];
    }
    if (type === 'energy' && facility.detailedIndicators.energy.measured[name]) {
      // @ts-ignore
      return facility.detailedIndicators.energy.measured[name];
    }
    return 0;
  } catch (error) {
    console.error('Error getting indicator value:', error);
    return 0;
  }
};

// Функція для генерації імітації історичних даних на основі поточного значення
export const getHistoricalData = (facility: Facility, type: string, name: string) => {
  const currentValue = getIndicatorValue(facility, type, name);
  const today = new Date();
  const data = [];

  // Генеруємо дані за останні 12 місяців
  for (let i = 11; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const month = date.toLocaleDateString('uk-UA', { month: 'short', year: 'numeric' });
    
    // Генеруємо значення з невеликими коливаннями навколо поточного значення
    const variation = Math.random() * 0.3 - 0.15; // від -15% до +15%
    const value = Math.max(0, currentValue * (1 + variation));
    
    data.push({
      date: month,
      value: Number(value.toFixed(2))
    });
  }

  return data;
};

// Функція для фільтрації об'єктів на основі критеріїв фільтрації
export const filterFacilities = (
  facilities: Facility[], 
  monitoringSystems: string[],
  indicators: {
    air: boolean;
    water: boolean;
    soil: boolean;
    radiation: boolean;
    waste: boolean;
    economic: boolean;
    health: boolean;
    energy: boolean;
  },
  threshold: number
) => {
  return facilities.filter(facility => {
    // Фільтрація за підсистемами моніторингу
    if (monitoringSystems.length > 0) {
      // Якщо об'єкт не має жодної з вибраних підсистем, не показуємо його
      const hasSelectedSystem = facility.monitoringSystems.some(
        system => monitoringSystems.includes(system)
      );
      if (!hasSelectedSystem) return false;
    }

    // Фільтрація за показниками
    const hasAir = indicators.air && facility.environmentalImpact.air > threshold;
    const hasWater = indicators.water && facility.environmentalImpact.water > threshold;
    const hasSoil = indicators.soil && facility.environmentalImpact.soil > threshold;
    
    // Перевіряємо хоча б один показник, якщо всі індикатори вимкнені, показуємо всі об'єкти
    const allIndicatorsOff = !Object.values(indicators).some(value => value);
    
    return allIndicatorsOff || hasAir || hasWater || hasSoil;
  });
};
