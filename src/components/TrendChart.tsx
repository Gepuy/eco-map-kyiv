
import { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
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

  useEffect(() => {
    console.log("TrendChart effect running with:", { 
      facilityId: facility.id, 
      indicatorType, 
      indicatorName 
    });
    
    // Отримуємо історичні дані для індикатора
    const historicalData = getHistoricalData(facility, indicatorType, indicatorName);
    console.log("Historical data received:", historicalData);
    setData(historicalData);
  }, [facility, indicatorType, indicatorName]);

  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <h3 className="text-lg font-semibold mb-4">
        Тенденція зміни показника: {indicatorName}
      </h3>
      
      <div className="h-64">
        <ChartContainer
          config={{
            parameter: { color: "#3a6e6c" }
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
              <Line 
                type="monotone" 
                dataKey="value" 
                name={indicatorName}
                stroke="#3a6e6c" 
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
};

export default TrendChart;
