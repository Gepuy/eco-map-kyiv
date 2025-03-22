
import { Facility } from "@/types/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface DetailedIndicatorsPanelProps {
  facility: Facility;
}

const DetailedIndicatorsPanel = ({ facility }: DetailedIndicatorsPanelProps) => {
  // Підготовка даних для графіків
  const airMeasuredData = [
    { name: "Пил", value: facility.detailedIndicators.air.measured.dust },
    { name: "NO2", value: facility.detailedIndicators.air.measured.no2 },
    { name: "SO2", value: facility.detailedIndicators.air.measured.so2 },
    { name: "CO", value: facility.detailedIndicators.air.measured.co },
    { name: "Формальдегід", value: facility.detailedIndicators.air.measured.formaldehyde },
    { name: "Свинець", value: facility.detailedIndicators.air.measured.lead },
    { name: "Бензопірен", value: facility.detailedIndicators.air.measured.benzopyrene }
  ];

  const waterMeasuredData = [
    { name: "Мікробіол.", value: facility.detailedIndicators.water.measured.microbiological },
    { name: "Епідеміол.", value: facility.detailedIndicators.water.measured.epidemiological },
    { name: "Органолепт.", value: facility.detailedIndicators.water.measured.organoleptic },
    { name: "Фіз.-хім.", value: facility.detailedIndicators.water.measured.physicochemical },
    { name: "Сан.-токс.", value: facility.detailedIndicators.water.measured.sanitary_toxicological },
    { name: "Радіація", value: facility.detailedIndicators.water.measured.radiation }
  ];

  const soilMeasuredData = [
    { name: "Гумус", value: facility.detailedIndicators.soil.measured.humus },
    { name: "Фосфор", value: facility.detailedIndicators.soil.measured.phosphorus },
    { name: "Калій", value: facility.detailedIndicators.soil.measured.potassium },
    { name: "Солоність", value: facility.detailedIndicators.soil.measured.salinity },
    { name: "Солонцюватість", value: facility.detailedIndicators.soil.measured.solonetzicity },
    { name: "Хім. забр.", value: facility.detailedIndicators.soil.measured.chemical_pollution },
    { name: "pH", value: facility.detailedIndicators.soil.measured.ph }
  ];

  const radiationMeasuredData = [
    { name: "Корот. період", value: facility.detailedIndicators.radiation.measured.short_half_life },
    { name: "Сер. період", value: facility.detailedIndicators.radiation.measured.medium_half_life },
    { name: "Повітря", value: facility.detailedIndicators.radiation.measured.air_radiation },
    { name: "Вода", value: facility.detailedIndicators.radiation.measured.water_radiation }
  ];

  const wasteMeasuredData = [
    { name: "Клас небезпеки", value: facility.detailedIndicators.waste.measured.hazard_class },
    { name: "Токсичність", value: facility.detailedIndicators.waste.measured.toxicity },
    { name: "Об'єм", value: facility.detailedIndicators.waste.measured.volume }
  ];

  const economicMeasuredData = [
    { name: "ВВП", value: facility.detailedIndicators.economic.measured.gross_product },
    { name: "Вантажообіг", value: facility.detailedIndicators.economic.measured.cargo_turnover },
    { name: "Пасажирообіг", value: facility.detailedIndicators.economic.measured.passenger_turnover },
    { name: "Експорт", value: facility.detailedIndicators.economic.measured.exports },
    { name: "Імпорт", value: facility.detailedIndicators.economic.measured.imports },
    { name: "Зарплати", value: facility.detailedIndicators.economic.measured.wages }
  ];

  const healthMeasuredData = [
    { name: "Демограф.", value: facility.detailedIndicators.health.measured.demographic },
    { name: "Захворюв.", value: facility.detailedIndicators.health.measured.disease_prevalence },
    { name: "Інвалідність", value: facility.detailedIndicators.health.measured.disability },
    { name: "Фіз. розвиток", value: facility.detailedIndicators.health.measured.physical_development }
  ];

  const energyMeasuredData = [
    { name: "Вода", value: facility.detailedIndicators.energy.measured.water_consumption },
    { name: "Електрика", value: facility.detailedIndicators.energy.measured.electricity_consumption },
    { name: "Газ", value: facility.detailedIndicators.energy.measured.gas_consumption },
    { name: "Тепло", value: facility.detailedIndicators.energy.measured.heat_consumption }
  ];

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Детальні показники моніторингу</h3>
      <Tabs defaultValue="air" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="air">Повітря</TabsTrigger>
          <TabsTrigger value="water">Вода</TabsTrigger>
          <TabsTrigger value="soil">Ґрунт</TabsTrigger>
          <TabsTrigger value="radiation">Радіація</TabsTrigger>
        </TabsList>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="waste">Відходи</TabsTrigger>
          <TabsTrigger value="economic">Економіка</TabsTrigger>
          <TabsTrigger value="health">Здоров'я</TabsTrigger>
          <TabsTrigger value="energy">Енергетика</TabsTrigger>
        </TabsList>

        <TabsContent value="air" className="space-y-4">
          <div className="h-64">
            <ChartContainer
              config={{
                parameter: { color: "#3a6e6c" }
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={airMeasuredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="value" name="Значення" fill="#3a6e6c" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          <div className="flex justify-between items-center p-3 bg-eco-50 rounded-md">
            <span className="font-medium">Індекс якості повітря:</span>
            <span className="bg-eco-100 px-3 py-1 rounded">
              {facility.detailedIndicators.air.calculated.air_quality_index}
            </span>
          </div>
        </TabsContent>

        <TabsContent value="water" className="space-y-4">
          <div className="h-64">
            <ChartContainer 
              config={{
                parameter: { color: "#2563eb" }
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={waterMeasuredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="value" name="Значення" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          <div className="flex justify-between items-center p-3 bg-eco-50 rounded-md">
            <span className="font-medium">Індекс забруднення води:</span>
            <span className="bg-eco-100 px-3 py-1 rounded">
              {facility.detailedIndicators.water.calculated.water_pollution_index}
            </span>
          </div>
        </TabsContent>

        <TabsContent value="soil" className="space-y-4">
          <div className="h-64">
            <ChartContainer
              config={{
                parameter: { color: "#854d0e" }
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={soilMeasuredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="value" name="Значення" fill="#854d0e" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          <div className="flex justify-between items-center p-3 bg-eco-50 rounded-md">
            <span className="font-medium">Бонітет ґрунту:</span>
            <span className="bg-eco-100 px-3 py-1 rounded">
              {facility.detailedIndicators.soil.calculated.soil_bonitet}
            </span>
          </div>
        </TabsContent>

        <TabsContent value="radiation" className="space-y-4">
          <div className="h-64">
            <ChartContainer
              config={{
                parameter: { color: "#d97706" }
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={radiationMeasuredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="value" name="Значення" fill="#d97706" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col justify-between p-3 bg-eco-50 rounded-md">
              <span className="font-medium">Ймовірність критичної події:</span>
              <span className="bg-eco-100 px-3 py-1 rounded text-center mt-2">
                {facility.detailedIndicators.radiation.calculated.critical_event_probability}
              </span>
            </div>
            <div className="flex flex-col justify-between p-3 bg-eco-50 rounded-md">
              <span className="font-medium">Екологічний ризик:</span>
              <span className="bg-eco-100 px-3 py-1 rounded text-center mt-2">
                {facility.detailedIndicators.radiation.calculated.environmental_risk}
              </span>
            </div>
            <div className="flex flex-col justify-between p-3 bg-eco-50 rounded-md">
              <span className="font-medium">Ризик для здоров'я:</span>
              <span className="bg-eco-100 px-3 py-1 rounded text-center mt-2">
                {facility.detailedIndicators.radiation.calculated.health_risk}
              </span>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="waste" className="space-y-4">
          <div className="h-64">
            <ChartContainer
              config={{
                parameter: { color: "#57534e" }
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={wasteMeasuredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="value" name="Значення" fill="#57534e" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          <div className="flex justify-between items-center p-3 bg-eco-50 rounded-md">
            <span className="font-medium">Рівень управління відходами:</span>
            <span className="bg-eco-100 px-3 py-1 rounded">
              {facility.detailedIndicators.waste.calculated.waste_management_level}
            </span>
          </div>
        </TabsContent>

        <TabsContent value="economic" className="space-y-4">
          <div className="h-64">
            <ChartContainer
              config={{
                parameter: { color: "#0284c7" }
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={economicMeasuredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="value" name="Значення" fill="#0284c7" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center p-2 bg-eco-50 rounded-md">
                <span>Індекс промисловості:</span>
                <span className="bg-eco-100 px-2 py-1 rounded">
                  {facility.detailedIndicators.economic.calculated.industry_index}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-eco-50 rounded-md">
                <span>Індекс сільського господарства:</span>
                <span className="bg-eco-100 px-2 py-1 rounded">
                  {facility.detailedIndicators.economic.calculated.agriculture_index}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-eco-50 rounded-md">
                <span>Індекс будівництва:</span>
                <span className="bg-eco-100 px-2 py-1 rounded">
                  {facility.detailedIndicators.economic.calculated.construction_index}
                </span>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center p-2 bg-eco-50 rounded-md">
                <span>ІСЦ:</span>
                <span className="bg-eco-100 px-2 py-1 rounded">
                  {facility.detailedIndicators.economic.calculated.consumer_price_index}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-eco-50 rounded-md">
                <span>ІЦВ:</span>
                <span className="bg-eco-100 px-2 py-1 rounded">
                  {facility.detailedIndicators.economic.calculated.producer_price_index}
                </span>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <div className="h-64">
            <ChartContainer
              config={{
                parameter: { color: "#e11d48" }
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={healthMeasuredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="value" name="Значення" fill="#e11d48" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col justify-between p-3 bg-eco-50 rounded-md">
              <span className="font-medium">Ризик захворювань:</span>
              <span className="bg-eco-100 px-3 py-1 rounded text-center mt-2">
                {facility.detailedIndicators.health.calculated.disease_risk}
              </span>
            </div>
            <div className="flex flex-col justify-between p-3 bg-eco-50 rounded-md">
              <span className="font-medium">Прогноз захворювань:</span>
              <span className="bg-eco-100 px-3 py-1 rounded text-center mt-2">
                {facility.detailedIndicators.health.calculated.disease_forecast}
              </span>
            </div>
            <div className="flex flex-col justify-between p-3 bg-eco-50 rounded-md">
              <span className="font-medium">Тривалість життя:</span>
              <span className="bg-eco-100 px-3 py-1 rounded text-center mt-2">
                {facility.detailedIndicators.health.calculated.life_expectancy}
              </span>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="energy" className="space-y-4">
          <div className="h-64">
            <ChartContainer
              config={{
                parameter: { color: "#4d7c0f" }
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={energyMeasuredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="value" name="Значення" fill="#4d7c0f" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          <div className="flex justify-between items-center p-3 bg-eco-50 rounded-md">
            <span className="font-medium">Енергоефективність:</span>
            <span className="bg-eco-100 px-3 py-1 rounded">
              {facility.detailedIndicators.energy.calculated.energy_efficiency}
            </span>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DetailedIndicatorsPanel;
