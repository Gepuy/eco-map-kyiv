
export interface Facility {
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

export const facilities: Facility[] = [
  {
    id: 1,
    name: "Київська ТЕЦ-5",
    type: "Теплоелектроцентраль",
    location: [30.326944, 50.392778],
    address: "вул. Промислова, 4",
    environmentalImpact: {
      air: 8,
      water: 6,
      soil: 4,
    },
    monitoringSystems: [
      "Атмосферне повітря",
      "Поверхневі води",
      "Викиди парникових газів",
    ],
    parameters: {
      energyConsumption: 85000,
      wasteProduction: 12000,
      carbonEmissions: 9500,
      waterUsage: 15000,
    },
  },
  {
    id: 2,
    name: "Дарницька ТЕЦ",
    type: "Теплоелектроцентраль",
    location: [30.638333, 50.4275],
    address: "вул. Гната Хоткевича, 20",
    environmentalImpact: {
      air: 7,
      water: 5,
      soil: 3,
    },
    monitoringSystems: [
      "Атмосферне повітря",
      "Поверхневі води",
      "Викиди парникових газів",
    ],
    parameters: {
      energyConsumption: 65000,
      wasteProduction: 8500,
      carbonEmissions: 7200,
      waterUsage: 12000,
    },
  },
  {
    id: 3,
    name: "Київський завод Росинка",
    type: "Харчова промисловість",
    location: [30.467778, 50.456389],
    address: "вул. Електротехнічна, 47",
    environmentalImpact: {
      air: 4,
      water: 6,
      soil: 3,
    },
    monitoringSystems: ["Якість води", "Промислові стоки"],
    parameters: {
      energyConsumption: 12000,
      wasteProduction: 2500,
      carbonEmissions: 1800,
      waterUsage: 8500,
    },
  },
  {
    id: 4,
    name: "Фармак",
    type: "Фармацевтична промисловість",
    location: [30.484722, 50.485833],
    address: "вул. Кирилівська, 63",
    environmentalImpact: {
      air: 5,
      water: 7,
      soil: 4,
    },
    monitoringSystems: [
      "Якість повітря",
      "Промислові стоки",
      "Фармацевтичні відходи",
    ],
    parameters: {
      energyConsumption: 18000,
      wasteProduction: 3200,
      carbonEmissions: 2500,
      waterUsage: 6500,
    },
  },
  {
    id: 5,
    name: "Київський картонно-паперовий комбінат",
    type: "Паперова промисловість",
    location: [30.795833, 50.351667],
    address: "вул. Київська, 130",
    environmentalImpact: {
      air: 6,
      water: 8,
      soil: 5,
    },
    monitoringSystems: ["Якість води", "Промислові викиди", "Тверді відходи"],
    parameters: {
      energyConsumption: 45000,
      wasteProduction: 15000,
      carbonEmissions: 5500,
      waterUsage: 25000,
    },
  },
  {
    id: 6,
    name: "Борщагівський хіміко-фармацевтичний завод",
    type: "Фармацевтична промисловість",
    location: [30.366667, 50.433333],
    address: "вул. Миру, 17",
    environmentalImpact: {
      air: 5,
      water: 6,
      soil: 4,
    },
    monitoringSystems: [
      "Якість повітря",
      "Промислові стоки",
      "Фармацевтичні відходи",
    ],
    parameters: {
      energyConsumption: 16000,
      wasteProduction: 2800,
      carbonEmissions: 2200,
      waterUsage: 5500,
    },
  },
  {
    id: 7,
    name: "Київський завод шампанських вин",
    type: "Харчова промисловість",
    location: [30.483333, 50.45],
    address: "вул. Сирецька, 27",
    environmentalImpact: {
      air: 3,
      water: 5,
      soil: 2,
    },
    monitoringSystems: ["Якість води", "Промислові стоки"],
    parameters: {
      energyConsumption: 8500,
      wasteProduction: 1800,
      carbonEmissions: 1200,
      waterUsage: 7500,
    },
  },
  {
    id: 8,
    name: "Завод Енергія",
    type: "Сміттєспалювальний завод",
    location: [30.633333, 50.433333],
    address: "вул. Колекторна, 44",
    environmentalImpact: {
      air: 9,
      water: 5,
      soil: 6,
    },
    monitoringSystems: [
      "Атмосферні викиди",
      "Тверді відходи",
      "Моніторинг діоксинів",
    ],
    parameters: {
      energyConsumption: 25000,
      wasteProduction: 180000,
      carbonEmissions: 12000,
      waterUsage: 4500,
    },
  },
  {
    id: 9,
    name: "Київський маргариновий завод",
    type: "Харчова промисловість",
    location: [30.466667, 50.483333],
    address: "вул. Куренівська, 18",
    environmentalImpact: {
      air: 4,
      water: 6,
      soil: 3,
    },
    monitoringSystems: ["Якість води", "Промислові стоки", "Харчові відходи"],
    parameters: {
      energyConsumption: 11000,
      wasteProduction: 2200,
      carbonEmissions: 1600,
      waterUsage: 8000,
    },
  },
  {
    id: 10,
    name: "Київський завод безалкогольних напоїв",
    type: "Харчова промисловість",
    location: [30.45, 50.466667],
    address: "вул. Плодова, 1",
    environmentalImpact: {
      air: 3,
      water: 7,
      soil: 2,
    },
    monitoringSystems: ["Якість води", "Промислові стоки"],
    parameters: {
      energyConsumption: 9500,
      wasteProduction: 1900,
      carbonEmissions: 1400,
      waterUsage: 9000,
    },
  },
];
