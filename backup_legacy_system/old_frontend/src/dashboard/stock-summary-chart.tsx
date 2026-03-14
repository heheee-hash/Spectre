"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface StockSummaryChartProps {
    data: {
        name: string;
        in: number;
        out: number;
    }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-card border border-border rounded-xl px-3 py-2.5 shadow-lg text-sm">
                <p className="text-muted-foreground text-xs mb-1.5 font-medium">{label}</p>
                {payload.map((entry: any) => (
                    <div key={entry.name} className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="capitalize text-foreground font-medium">{entry.name}:</span>
                        <span className="text-muted-foreground">{entry.value} units</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export function StockSummaryChart({ data }: StockSummaryChartProps) {
    return (
        <Card className="col-span-1 lg:col-span-2 border-border/60 shadow-sm">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-base font-semibold">Stock Movements</CardTitle>
                        <CardDescription className="text-xs mt-0.5">
                            Weekly incoming vs outgoing stock
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                            Incoming
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                            Outgoing
                        </span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="gradIn" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="oklch(0.50 0.21 264)" stopOpacity={0.18} />
                                    <stop offset="95%" stopColor="oklch(0.50 0.21 264)" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="gradOut" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="oklch(0.60 0.21 22)" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="oklch(0.60 0.21 22)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="oklch(0.88 0.009 264)" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: "oklch(0.52 0.02 264)" }}
                                dy={8}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: "oklch(0.52 0.02 264)" }}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "oklch(0.88 0.009 264)", strokeWidth: 1, strokeDasharray: "4 4" }} />
                            <Area
                                type="monotone"
                                dataKey="in"
                                name="Incoming"
                                stroke="oklch(0.50 0.21 264)"
                                strokeWidth={2}
                                fill="url(#gradIn)"
                                dot={false}
                                activeDot={{ r: 4, strokeWidth: 2, stroke: "white", fill: "oklch(0.50 0.21 264)" }}
                            />
                            <Area
                                type="monotone"
                                dataKey="out"
                                name="Outgoing"
                                stroke="oklch(0.60 0.21 22)"
                                strokeWidth={2}
                                fill="url(#gradOut)"
                                dot={false}
                                activeDot={{ r: 4, strokeWidth: 2, stroke: "white", fill: "oklch(0.60 0.21 22)" }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
