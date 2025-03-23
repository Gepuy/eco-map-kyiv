
import { Facility } from '@/types/supabase';

// Функція для отримання значення індикатора за шляхом
const getIndicatorValue = (facility: Facility, type: string, name: string): number => {
  try {
    // @ts-ignore - Використовуємо динамічний доступ до властивостей
    if (type === 'air' && facility.detailedIndicators?.air?.measured[name]) {
      // @ts-ignore
      return facility.detailedIndicators.air.measured[name];
    }
    if (type === 'water' && facility.detailedIndicators?.water?.measured[name]) {
      // @ts-ignore
      return facility.detailedIndicators.water.measured[name];
    }
    if (type === 'soil' && facility.detailedIndicators?.soil?.measured[name]) {
      // @ts-ignore
      return facility.detailedIndicators.soil.measured[name];
    }
    if (type === 'radiation' && facility.detailedIndicators?.radiation?.measured[name]) {
      // @ts-ignore
      return facility.detailedIndicators.radiation.measured[name];
    }
    if (type === 'waste' && facility.detailedIndicators?.waste?.measured[name]) {
      // @ts-ignore
      return facility.detailedIndicators.waste.measured[name];
    }
    if (type === 'economic' && facility.detailedIndicators?.economic?.measured[name]) {
      // @ts-ignore
      return facility.detailedIndicators.economic.measured[name];
    }
    if (type === 'health' && facility.detailedIndicators?.health?.measured[name]) {
      // @ts-ignore
      return facility.detailedIndicators.health.measured[name];
    }
    if (type === 'energy' && facility.detailedIndicators?.energy?.measured[name]) {
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
  console.log("getHistoricalData params:", { type, name });
  
  // Отримуємо поточне значення з даних установи
  let currentValue;
  
  try {
    // Якщо передано тип та ім'я показника
    if (type && name) {
      // Переводимо назву показника з людського формату в key формат
      const nameKey = convertIndicatorNameToKey(name);
      console.log("Converted name to key:", nameKey);
      
      // Отримуємо значення з бази даних за типом та ключем
      // @ts-ignore
      if (facility.detailedIndicators && facility.detailedIndicators[type]?.measured) {
        // @ts-ignore
        currentValue = facility.detailedIndicators[type].measured[nameKey];
        console.log("Found value:", currentValue, "for type:", type, "and key:", nameKey);
      }
    }
  } catch (error) {
    console.error("Error getting current value:", error);
  }
  
  // Якщо не знайдено значення, використовуємо дефолтне
  if (currentValue === undefined || currentValue === null) {
    currentValue = 5.0;
    console.log("Using default value:", currentValue);
  }
  
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

  console.log("Generated historical data:", data);
  return data;
};

// Функція для конвертації назви індикатора з людського формату в ключовий
const convertIndicatorNameToKey = (name: string): string => {
  const nameMap: {[key: string]: string} = {
    'Пил': 'dust',
    'NO2': 'no2',
    'SO2': 'so2',
    'CO': 'co',
    'Формальдегід': 'formaldehyde',
    'Свинець': 'lead',
    'Бензопірен': 'benzopyrene',
    'Мікробіологічні показники': 'microbiological',
    'Епідеміологічні показники': 'epidemiological',
    'Органолептичні показники': 'organoleptic',
    'Фізико-хімічні показники': 'physicochemical',
    'Санітарно-токсикологічні показники': 'sanitary_toxicological',
    'Радіація води': 'radiation',
    'Гумус': 'humus',
    'Фосфор': 'phosphorus',
    'Калій': 'potassium',
    'Солоність': 'salinity',
    'Солонцюватість': 'solonetzicity',
    'Хімічне забруднення': 'chemical_pollution',
    'pH': 'ph',
    'Коротко напівперіодні': 'short_half_life',
    'Середньо напівперіодні': 'medium_half_life',
    'Радіація повітря': 'air_radiation',
    'Клас небезпеки': 'hazard_class',
    'Токсичність': 'toxicity',
    'Об\'єм відходів': 'volume',
    'ВВП': 'gross_product',
    'Вантажообіг': 'cargo_turnover',
    'Пасажирообіг': 'passenger_turnover',
    'Експорт': 'exports',
    'Імпорт': 'imports',
    'Зарплати': 'wages',
    'Демографічні показники': 'demographic',
    'Захворюваність': 'disease_prevalence',
    'Інвалідність': 'disability',
    'Фізичний розвиток': 'physical_development',
    'Споживання води': 'water_consumption',
    'Споживання електроенергії': 'electricity_consumption',
    'Споживання газу': 'gas_consumption',
    'Споживання тепла': 'heat_consumption'
  };

  return nameMap[name] || name.toLowerCase().replace(/\s+/g, '_');
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
