"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface StockCategoryChartProps {
    data: {
        name: string;
        value: number;
    }[];
}

const COLORS = [
    "oklch(0.50 0.21 264)", // Indigo
    "oklch(0.62 0.18 162)", // Emerald
    "oklch(0.71 0.17 55)",  // Amber
    "oklch(0.60 0.21 22)",  // Rose
    "oklch(0.55 0.22 255)", // Blue
    "oklch(0.40 0.02 264)", // Slate
];

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-card border border-border rounded-xl px-3 py-2 shadow-lg text-sm">
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: payload[0].payload.fill }} />
                    <span className="font-medium">{payload[0].name}:</span>
                    <span className="text-muted-foreground">{payload[0].value.toLocaleString()} units</span>
                </div>
            </div>
        );
    }
    return null;
};

export function StockCategoryChart({ data }: StockCategoryChartProps) {
    return (
        <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Stock by Category</CardTitle>
                <CardDescription className="text-xs">Distribution of units across categories</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend 
                                verticalAlign="bottom" 
                                height={36}
                                iconType="circle"
                                formatter={(value) => <span className="text-[11px] text-muted-foreground font-medium">{value}</span>}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
