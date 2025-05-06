
import React from 'react';
import { Facility } from '@/types/supabase';
import { 
  calculateAirQualityIndex, 
  calculateWaterPollutionIndex, 
  calculateSoilPollutionIndex,
  calculateRadiationRiskIndex,
  calculateEnergyEfficiencyIndex,
  getPollutionColor,
  getPollutionLevel
} from '@/utils/indicatorsCalculation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CircleHelp, 
  Wind, 
  Droplet, 
  Sprout, 
  Radiation, 
  Zap,
  AlertTriangle
} from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface IntegratedIndicatorsPanelProps {
  facility: Facility;
}

const IntegratedIndicatorsPanel: React.FC<IntegratedIndicatorsPanelProps> = ({ facility }) => {
  // Розрахунок інтегральних показників для об'єкта
  const airQualityIndex = calculateAirQualityIndex(facility);
  const waterPollutionIndex = calculateWaterPollutionIndex(facility);
  const soilPollutionIndex = calculateSoilPollutionIndex(facility);
  const radiationRiskIndex = calculateRadiationRiskIndex(facility);
  const energyEfficiencyIndex = calculateEnergyEfficiencyIndex(facility);
  
  // Кольори для індикаторів
  const airColor = getPollutionColor(airQualityIndex, 'airQuality');
  const waterColor = getPollutionColor(waterPollutionIndex, 'waterPollution');
  const soilColor = getPollutionColor(soilPollutionIndex, 'soilPollution');
  const radiationColor = getPollutionColor(radiationRiskIndex, 'radiation');
  const energyColor = getPollutionColor(energyEfficiencyIndex, 'energy');
  
  // Текстові описи станів
  const airLevel = getPollutionLevel(airQualityIndex, 'airQuality');
  const waterLevel = getPollutionLevel(waterPollutionIndex, 'waterPollution');
  const soilLevel = getPollutionLevel(soilPollutionIndex, 'soilPollution');
  const radiationLevel = getPollutionLevel(radiationRiskIndex, 'radiation');
  const energyLevel = getPollutionLevel(energyEfficiencyIndex, 'energy');

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
        Інтегральні показники
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <CircleHelp className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">Інтегральні показники розраховуються на основі виміряних даних з використанням спеціальних формул</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </h3>
      
      <Tabs defaultValue="air" className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="air" className="flex items-center gap-1">
            <Wind className="h-4 w-4" /> Повітря
          </TabsTrigger>
          <TabsTrigger value="water" className="flex items-center gap-1">
            <Droplet className="h-4 w-4" /> Вода
          </TabsTrigger>
          <TabsTrigger value="soil" className="flex items-center gap-1">
            <Sprout className="h-4 w-4" /> Ґрунт
          </TabsTrigger>
          <TabsTrigger value="radiation" className="flex items-center gap-1">
            <Radiation className="h-4 w-4" /> Радіація
          </TabsTrigger>
          <TabsTrigger value="energy" className="flex items-center gap-1">
            <Zap className="h-4 w-4" /> Енергетика
          </TabsTrigger>
        </TabsList>

        {/* Показник якості повітря */}
        <TabsContent value="air">
          <div className="rounded-lg bg-white p-4 shadow-sm border">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-base font-medium">Індекс якості повітря</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  I = (1/N) * Σ(qi/q̄), де N - число контрольно-вимірювальних постів, qi - концентрація домішок, q̄ - середньосезонна концентрація
                </p>
              </div>
              <Badge 
                style={{backgroundColor: airColor, color: airColor === '#84cc16' ? '#365314' : '#fff'}}
                className="text-xs px-2 py-1"
              >
                {airLevel}
              </Badge>
            </div>
            
            <div className="flex items-center mt-2">
              <div 
                className="h-32 w-32 rounded-full flex items-center justify-center text-3xl font-bold border-8"
                style={{borderColor: airColor}}
              >
                {airQualityIndex}
              </div>
              <div className="ml-6 space-y-2">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Основні забруднювачі:</span>
                  <span className="text-sm">
                    {facility.detailedIndicators.air.measured.dust > 0.2 && "Пил, "}
                    {facility.detailedIndicators.air.measured.no2 > 0.05 && "NO₂, "}
                    {facility.detailedIndicators.air.measured.so2 > 0.06 && "SO₂, "}
                    {facility.detailedIndicators.air.measured.co > 4 && "CO"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Ризик для здоров'я:</span>
                  <span className="text-sm">
                    {airQualityIndex < 1 ? "Низький" : airQualityIndex < 3 ? "Середній" : "Високий"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Рекомендації:</span>
                  <span className="text-sm">
                    {airQualityIndex < 1 
                      ? "Безпечно для всіх груп населення" 
                      : airQualityIndex < 3 
                        ? "Чутливим групам обмежити активність на відкритому повітрі" 
                        : "Уникати перебування на відкритому повітрі"}
                  </span>
                </div>
              </div>
            </div>
            
            {airQualityIndex > 3 && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center text-sm">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                <span>Критичне перевищення норм забруднення повітря. Рекомендується посилений моніторинг та заходи щодо зменшення викидів.</span>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Показник якості води */}
        <TabsContent value="water">
          <div className="rounded-lg bg-white p-4 shadow-sm border">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-base font-medium">Індекс забруднення води</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  С1/ГДК1 + С2/ГДК2 + ... + Сn/ГДКn ≤ 1, де С - концентрація речовин, ГДК - гранично допустимі концентрації
                </p>
              </div>
              <Badge 
                style={{backgroundColor: waterColor, color: waterColor === '#84cc16' ? '#365314' : '#fff'}}
                className="text-xs px-2 py-1"
              >
                {waterLevel}
              </Badge>
            </div>
            
            <div className="flex items-center mt-2">
              <div 
                className="h-32 w-32 rounded-full flex items-center justify-center text-3xl font-bold border-8"
                style={{borderColor: waterColor}}
              >
                {waterPollutionIndex}
              </div>
              <div className="ml-6 space-y-2">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Ключові показники:</span>
                  <span className="text-sm">
                    {facility.detailedIndicators.water.measured.microbiological > 0.8 && "Мікробіологічні, "}
                    {facility.detailedIndicators.water.measured.physicochemical > 2 && "Фізико-хімічні, "}
                    {facility.detailedIndicators.water.measured.sanitary_toxicological > 0.8 && "Санітарно-токсикологічні"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Придатність для використання:</span>
                  <span className="text-sm">
                    {waterPollutionIndex < 0.8 ? "Без обмежень" : waterPollutionIndex < 1.2 ? "Після очищення" : "Технічне використання"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Необхідні заходи:</span>
                  <span className="text-sm">
                    {waterPollutionIndex < 0.8 
                      ? "Плановий моніторинг" 
                      : waterPollutionIndex < 1.2 
                        ? "Посилений контроль" 
                        : "Термінові заходи з очищення"}
                  </span>
                </div>
              </div>
            </div>
            
            {waterPollutionIndex > 1.2 && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center text-sm">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                <span>Виявлено перевищення ГДК забруднюючих речовин. Рекомендується додатковий аналіз та очисні заходи.</span>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Показник якості ґрунту */}
        <TabsContent value="soil">
          <div className="rounded-lg bg-white p-4 shadow-sm border">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-base font-medium">Індекс забруднення ґрунтів</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  IS = Σ(Ci1/Cфі1)^3 + Σ(Ci2/Cфі2)^2 + Σ(Ci3/Cфі3), де Ci - концентрація забруднюючої речовини, Cфі - фонова концентрація
                </p>
              </div>
              <Badge 
                style={{backgroundColor: soilColor, color: soilColor === '#84cc16' ? '#365314' : '#fff'}}
                className="text-xs px-2 py-1"
              >
                {soilLevel}
              </Badge>
            </div>
            
            <div className="flex items-center mt-2">
              <div 
                className="h-32 w-32 rounded-full flex items-center justify-center text-3xl font-bold border-8"
                style={{borderColor: soilColor}}
              >
                {soilPollutionIndex}
              </div>
              <div className="ml-6 space-y-2">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Основні забруднювачі:</span>
                  <span className="text-sm">
                    {facility.detailedIndicators.soil.measured.chemical_pollution > 0.7 && "Хімічне забруднення, "}
                    {facility.detailedIndicators.soil.measured.salinity > 0.2 && "Засолення, "}
                    {Math.abs(facility.detailedIndicators.soil.measured.ph - 6.5) > 1.5 && "Кислотність"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Категорія ґрунтів:</span>
                  <span className="text-sm">
                    {soilPollutionIndex < 3 ? "Незабруднені" : soilPollutionIndex < 8 ? "Помірно забруднені" : "Сильно забруднені"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Рекомендоване використання:</span>
                  <span className="text-sm">
                    {soilPollutionIndex < 3 
                      ? "Без обмежень" 
                      : soilPollutionIndex < 8 
                        ? "Обмежене сільськогосподарське використання" 
                        : "Технічне використання, рекультивація"}
                  </span>
                </div>
              </div>
            </div>
            
            {soilPollutionIndex > 8 && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center text-sm">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                <span>Критичний рівень забруднення ґрунтів. Рекомендовано детальне дослідження та заходи з рекультивації.</span>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Показник радіації */}
        <TabsContent value="radiation">
          <div className="rounded-lg bg-white p-4 shadow-sm border">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-base font-medium">Індекс радіаційного ризику</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Комбінований індекс, що враховує інгаляційний, водний та зовнішній шляхи радіаційного впливу
                </p>
              </div>
              <Badge 
                style={{backgroundColor: radiationColor, color: radiationColor === '#84cc16' ? '#365314' : '#fff'}}
                className="text-xs px-2 py-1"
              >
                {radiationLevel}
              </Badge>
            </div>
            
            <div className="flex items-center mt-2">
              <div 
                className="h-32 w-32 rounded-full flex items-center justify-center text-3xl font-bold border-8"
                style={{borderColor: radiationColor}}
              >
                {radiationRiskIndex}
              </div>
              <div className="ml-6 space-y-2">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Основні джерела:</span>
                  <span className="text-sm">
                    {facility.detailedIndicators.radiation.measured.air_radiation > 0.6 && "Повітря, "}
                    {facility.detailedIndicators.radiation.measured.water_radiation > 0.5 && "Вода, "}
                    {facility.detailedIndicators.radiation.measured.short_half_life > 1 && "Короткоживучі радіонукліди"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Ризик для здоров'я:</span>
                  <span className="text-sm">
                    {radiationRiskIndex < 1.5 ? "Мінімальний" : radiationRiskIndex < 3 ? "Підвищений" : "Високий"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Необхідні заходи:</span>
                  <span className="text-sm">
                    {radiationRiskIndex < 1.5 
                      ? "Планові заміри" 
                      : radiationRiskIndex < 3 
                        ? "Посилений моніторинг" 
                        : "Обмеження доступу, додаткові захисні заходи"}
                  </span>
                </div>
              </div>
            </div>
            
            {radiationRiskIndex > 3 && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center text-sm">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                <span>Підвищений радіаційний фон. Необхідно вжити додаткові заходи безпеки та провести детальне дослідження джерел випромінювання.</span>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Показники енергоефективності */}
        <TabsContent value="energy">
          <div className="rounded-lg bg-white p-4 shadow-sm border">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-base font-medium">Індекс енергоефективності</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Комплексний показник ефективності використання енергоресурсів (вода, електроенергія, газ, тепло)
                </p>
              </div>
              <Badge 
                style={{backgroundColor: energyColor, color: energyColor === '#84cc16' ? '#365314' : '#fff'}}
                className="text-xs px-2 py-1"
              >
                {energyLevel}
              </Badge>
            </div>
            
            <div className="flex items-center mt-2">
              <div 
                className="h-32 w-32 rounded-full flex items-center justify-center text-3xl font-bold border-8"
                style={{borderColor: energyColor}}
              >
                {energyEfficiencyIndex}
              </div>
              <div className="ml-6 space-y-2">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Основні споживачі:</span>
                  <span className="text-sm">
                    {facility.detailedIndicators.energy.measured.electricity_consumption > 1200 && "Електроенергія, "}
                    {facility.detailedIndicators.energy.measured.gas_consumption > 600 && "Газ, "}
                    {facility.detailedIndicators.energy.measured.water_consumption > 60 && "Вода"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Потенціал економії:</span>
                  <span className="text-sm">
                    {energyEfficiencyIndex > 7 ? "Низький" : energyEfficiencyIndex > 4 ? "Середній" : "Високий"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Рекомендації:</span>
                  <span className="text-sm">
                    {energyEfficiencyIndex > 7 
                      ? "Підтримка поточних показників" 
                      : energyEfficiencyIndex > 4 
                        ? "Покращення систем енергозбереження" 
                        : "Комплексна модернізація енергосистем"}
                  </span>
                </div>
              </div>
            </div>
            
            {energyEfficiencyIndex < 4 && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center text-sm">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                <span>Низька енергоефективність. Рекомендуються заходи з енергоаудиту та модернізації енергоспоживаючого обладнання.</span>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegratedIndicatorsPanel;
