
import { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  ReferenceLine
} from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Facility } from '@/types/supabase';
import { getHistoricalData } from '@/utils/dataUtils';

interface TrendChartProps {
  facility: Facility;
  indicatorType: string;
  indicatorName: string;
}

const TrendChart = ({ facility, indicatorType, indicatorName }: TrendChartProps) => {
  const [data, setData] = useState<any[]>([]);
  const [maxValue, setMaxValue] = useState<number>(0);
  const [averageValue, setAverageValue] = useState<number>(0);

  useEffect(() => {
    console.log("TrendChart effect running with:", { 
      facilityId: facility.id, 
      indicatorType, 
      indicatorName 
    });
    
    // Отримуємо історичні дані для індикатора
    const historicalData = getHistoricalData(facility, indicatorType, indicatorName);
    console.log("Historical data received:", historicalData);
    
    // Обчислюємо максимальне та середнє значення для графіка
    if (historicalData.length > 0) {
      const max = Math.max(...historicalData.map(item => item.value));
      const sum = historicalData.reduce((acc, item) => acc + item.value, 0);
      const avg = sum / historicalData.length;
      
      setMaxValue(max);
      setAverageValue(parseFloat(avg.toFixed(2)));
    }
    
    setData(historicalData);
  }, [facility, indicatorType, indicatorName]);

  // Визначаємо колір лінії залежно від типу індикатора
  const getLineColor = (type: string) => {
    switch (type) {
      case 'air': return '#ef4444'; // червоний для повітря
      case 'water': return '#3b82f6'; // синій для води
      case 'soil': return '#84cc16'; // зелений для ґрунту
      case 'radiation': return '#f59e0b'; // оранжевий для радіації
      case 'waste': return '#8b5cf6'; // фіолетовий для відходів
      case 'economic': return '#0ea5e9'; // голубий для економіки
      case 'health': return '#ec4899'; // рожевий для здоров'я
      case 'energy': return '#14b8a6'; // бірюзовий для енергетики
      default: return '#3a6e6c'; // стандартний колір
    }
  };

  const lineColor = getLineColor(indicatorType);

  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <h3 className="text-lg font-semibold mb-4">
        Тенденція зміни показника: {indicatorName}
      </h3>
      
      <div className="flex items-center justify-between mb-2 text-sm text-gray-600">
        <div>Об'єкт: <span className="font-medium">{facility.name}</span></div>
        <div>Середнє значення: <span className="font-medium">{averageValue}</span></div>
      </div>
      
      <div className="h-64">
        <ChartContainer
          config={{
            parameter: { color: lineColor }
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend />
              <ReferenceLine 
                y={averageValue} 
                label={{ 
                  value: `Сер: ${averageValue}`,
                  position: 'insideBottomRight'
                }} 
                stroke="#666" 
                strokeDasharray="3 3" 
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                name={indicatorName}
                stroke={lineColor} 
                activeDot={{ r: 8 }} 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
};

export default TrendChart;
