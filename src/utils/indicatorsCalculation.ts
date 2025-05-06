
import { Facility } from "@/types/supabase";

/**
 * Розраховує інтегральний показник якості повітря
 * I = (1/N) * Σ(qi/q̄)
 */
export const calculateAirQualityIndex = (facility: Facility): number => {
  const { dust, no2, so2, co, formaldehyde, lead, benzopyrene } = facility.detailedIndicators.air.measured;
  
  // Опорні середньосезонні концентрації для порівняння
  const baseValues = { dust: 0.15, no2: 0.04, so2: 0.05, co: 3.0, formaldehyde: 0.003, lead: 0.0003, benzopyrene: 0.000001 };
  
  // Розраховуємо відношення для кожної домішки
  const ratios = [
    dust / baseValues.dust,
    no2 / baseValues.no2,
    so2 / baseValues.so2,
    co / baseValues.co,
    formaldehyde / baseValues.formaldehyde,
    lead / baseValues.lead,
    benzopyrene / baseValues.benzopyrene
  ];
  
  // Підраховуємо середнє значення відношень
  const sum = ratios.reduce((acc, ratio) => acc + ratio, 0);
  return parseFloat((sum / ratios.length).toFixed(2));
};

/**
 * Розраховує інтегральний показник якості води
 * C1/ГДК1 + C2/ГДК2 + ... + Cn/ГДКn ≤ 1
 */
export const calculateWaterPollutionIndex = (facility: Facility): number => {
  const { microbiological, epidemiological, organoleptic, physicochemical, sanitary_toxicological, radiation } = 
    facility.detailedIndicators.water.measured;
  
  // Гранично допустимі концентрації для різних показників
  const maxValues = { 
    microbiological: 1.0, 
    epidemiological: 1.0, 
    organoleptic: 2.0, 
    physicochemical: 3.0, 
    sanitary_toxicological: 1.0, 
    radiation: 1.0 
  };
  
  // Розраховуємо суму відношень до ГДК
  const pollutionIndex = 
    microbiological / maxValues.microbiological +
    epidemiological / maxValues.epidemiological +
    organoleptic / maxValues.organoleptic +
    physicochemical / maxValues.physicochemical +
    sanitary_toxicological / maxValues.sanitary_toxicological +
    radiation / maxValues.radiation;
  
  return parseFloat(pollutionIndex.toFixed(2));
};

/**
 * Розраховує інтегральний показник забруднення ґрунтів
 * IS = Σ(Ci1/Cфі1)^3 + Σ(Ci2/Cфі2)^2 + Σ(Ci3/Cфі3)
 */
export const calculateSoilPollutionIndex = (facility: Facility): number => {
  const { humus, phosphorus, potassium, salinity, solonetzicity, chemical_pollution, ph } = 
    facility.detailedIndicators.soil.measured;
  
  // Фонові значення для кожного показника
  const backgroundValues = { 
    humus: 2.0, 
    phosphorus: 10.0, 
    potassium: 100.0, 
    salinity: 0.1, 
    solonetzicity: 0.2, 
    chemical_pollution: 0.5, 
    ph: 6.5 
  };
  
  // Класифікація забруднювачів за класами небезпеки
  // Клас 1 (найвищий): chemical_pollution
  // Клас 2: salinity, solonetzicity
  // Клас 3: інші показники
  
  const class1 = Math.pow(chemical_pollution / backgroundValues.chemical_pollution, 3);
  const class2 = Math.pow(salinity / backgroundValues.salinity, 2) + 
                Math.pow(solonetzicity / backgroundValues.solonetzicity, 2);
  const class3 = humus / backgroundValues.humus + 
                phosphorus / backgroundValues.phosphorus + 
                potassium / backgroundValues.potassium +
                Math.abs(ph - backgroundValues.ph) / 2;
  
  return parseFloat((class1 + class2 + class3).toFixed(2));
};

/**
 * Розраховує інтегральний показник радіаційних ризиків
 */
export const calculateRadiationRiskIndex = (facility: Facility): number => {
  const { short_half_life, medium_half_life, air_radiation, water_radiation } = 
    facility.detailedIndicators.radiation.measured;
  
  // Коефіцієнти для різних шляхів радіаційного впливу
  const inhalationFactor = 0.4;
  const waterFactor = 0.3;
  const externalFactor = 0.3;
  
  // Розрахунок компонентів ризику
  const inhalationRisk = air_radiation * inhalationFactor;
  const waterRisk = water_radiation * waterFactor;
  const externalRisk = (short_half_life + medium_half_life) * externalFactor;
  
  // Загальний індекс ризику
  return parseFloat((inhalationRisk + waterRisk + externalRisk).toFixed(2));
};

/**
 * Розраховує інтегральний показник енергетичного стану
 */
export const calculateEnergyEfficiencyIndex = (facility: Facility): number => {
  const { water_consumption, electricity_consumption, gas_consumption, heat_consumption } = 
    facility.detailedIndicators.energy.measured;
  
  // Нормативні значення для порівняння
  const normalValues = { 
    water: 50.0, 
    electricity: 1000.0, 
    gas: 500.0, 
    heat: 200.0 
  };
  
  // Розрахунок відносного споживання ресурсів
  const waterRatio = water_consumption / normalValues.water;
  const electricityRatio = electricity_consumption / normalValues.electricity;
  const gasRatio = gas_consumption / normalValues.gas;
  const heatRatio = heat_consumption / normalValues.heat;
  
  // Зворотний показник (нижче значення = краща ефективність)
  const energyConsumptionIndex = (waterRatio + electricityRatio + gasRatio + heatRatio) / 4;
  return parseFloat((10 - energyConsumptionIndex * 2).toFixed(2));
};

/**
 * Визначає колір для візуалізації рівня забруднення
 */
export const getPollutionColor = (value: number, type: string): string => {
  // Різні типи показників мають різні порогові значення
  const thresholds = {
    air: { low: 1, medium: 3 },
    water: { low: 0.8, medium: 1.2 },
    soil: { low: 3, medium: 8 },
    radiation: { low: 1.5, medium: 3 },
    energy: { low: 4, medium: 7 }
  };
  
  // Для інтегрального індексу якості повітря нижчі значення - кращі
  if (type === 'airQuality') {
    if (value < thresholds.air.low) return '#84cc16'; // зелений
    if (value < thresholds.air.medium) return '#fbbf24'; // жовтий
    return '#ef4444'; // червоний
  }
  
  // Для індексу забруднення води нижчі значення - кращі
  if (type === 'waterPollution') {
    if (value < thresholds.water.low) return '#84cc16'; // зелений
    if (value < thresholds.water.medium) return '#fbbf24'; // жовтий
    return '#ef4444'; // червоний
  }
  
  // Для індексу забруднення ґрунтів нижчі значення - кращі
  if (type === 'soilPollution') {
    if (value < thresholds.soil.low) return '#84cc16'; // зелений
    if (value < thresholds.soil.medium) return '#fbbf24'; // жовтий
    return '#ef4444'; // червоний
  }
  
  // Для індексу радіації нижчі значення - кращі
  if (type === 'radiation') {
    if (value < thresholds.radiation.low) return '#84cc16'; // зелений
    if (value < thresholds.radiation.medium) return '#fbbf24'; // жовтий
    return '#ef4444'; // червоний
  }
  
  // Для індексу енергоефективності вищі значення - кращі (зворотня залежність)
  if (type === 'energy') {
    if (value > thresholds.energy.medium) return '#84cc16'; // зелений
    if (value > thresholds.energy.low) return '#fbbf24'; // жовтий
    return '#ef4444'; // червоний
  }
  
  // За замовчуванням
  return '#84cc16';
};

/**
 * Повертає текстовий опис стану для показника
 */
export const getPollutionLevel = (value: number, type: string): string => {
  // Визначаємо пороги для різних типів показників
  const thresholds = {
    air: { low: 1, medium: 3 },
    water: { low: 0.8, medium: 1.2 },
    soil: { low: 3, medium: 8 },
    radiation: { low: 1.5, medium: 3 },
    energy: { low: 4, medium: 7 }
  };
  
  if (type === 'airQuality') {
    if (value < thresholds.air.low) return "Низький рівень забруднення";
    if (value < thresholds.air.medium) return "Середній рівень забруднення";
    return "Високий рівень забруднення";
  }
  
  if (type === 'waterPollution') {
    if (value < thresholds.water.low) return "Допустимий рівень забруднення";
    if (value < thresholds.water.medium) return "Підвищений рівень забруднення";
    return "Небезпечний рівень забруднення";
  }
  
  if (type === 'soilPollution') {
    if (value < thresholds.soil.low) return "Чисті ґрунти";
    if (value < thresholds.soil.medium) return "Помірно забруднені ґрунти";
    return "Сильно забруднені ґрунти";
  }
  
  if (type === 'radiation') {
    if (value < thresholds.radiation.low) return "Безпечний рівень";
    if (value < thresholds.radiation.medium) return "Підвищений рівень";
    return "Небезпечний рівень";
  }
  
  if (type === 'energy') {
    if (value > thresholds.energy.medium) return "Висока енергоефективність";
    if (value > thresholds.energy.low) return "Середня енергоефективність";
    return "Низька енергоефективність";
  }
  
  return "Невідомий рівень";
};

/**
 * Розраховує всі інтегральні показники для об'єкта
 */
export const calculateAllIndicators = (facility: Facility) => {
  return {
    airQualityIndex: calculateAirQualityIndex(facility),
    waterPollutionIndex: calculateWaterPollutionIndex(facility),
    soilPollutionIndex: calculateSoilPollutionIndex(facility),
    radiationRiskIndex: calculateRadiationRiskIndex(facility),
    energyEfficiencyIndex: calculateEnergyEfficiencyIndex(facility)
  };
};
