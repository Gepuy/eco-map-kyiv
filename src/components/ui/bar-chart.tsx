
import React from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { 
  BarChart as RechartsBarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  ResponsiveContainer
} from 'recharts';

interface BarChartProps {
  data: any[];
  index: string;
  value: string;
  formatter?: (value: number) => string;
}

export function BarChart({ data, index, value, formatter }: BarChartProps) {
  return (
    <ChartContainer config={{}} className="aspect-[4/3]">
      <RechartsBarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey={index}
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          tickFormatter={formatter}
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip 
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <ChartTooltipContent
                  active={active}
                  payload={payload}
                  formatter={(val) => formatter ? formatter(val as number) : val}
                />
              );
            }
            return null;
          }}
        />
        <Bar dataKey={value} fill="#8884d8" radius={[4, 4, 0, 0]} />
      </RechartsBarChart>
    </ChartContainer>
  );
}
