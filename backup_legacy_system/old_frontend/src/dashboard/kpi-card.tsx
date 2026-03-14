import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon: LucideIcon;
    trend?: {
        value: number;
        isUpward: boolean;
    };
    color?: "indigo" | "emerald" | "amber" | "rose" | "blue" | "slate";
}

const colorMap = {
    indigo: "kpi-icon-indigo",
    emerald: "kpi-icon-emerald",
    amber: "kpi-icon-amber",
    rose: "kpi-icon-rose",
    blue: "kpi-icon-blue",
    slate: "kpi-icon-slate",
};

export function KpiCard({ title, value, description, icon: Icon, trend, color = "indigo" }: KpiCardProps) {
    return (
        <Card className="card-hover border-border/60 shadow-sm overflow-hidden">
            <CardContent className="p-5">
                <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{title}</p>
                        <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
                        {(description || trend) && (
                            <div className="flex items-center gap-1.5 mt-2">
                                {trend && (
                                    <span className={cn(
                                        "inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full",
                                        trend.isUpward
                                            ? "text-emerald-700 bg-emerald-500/10"
                                            : "text-rose-700 bg-rose-500/10"
                                    )}>
                                        {trend.isUpward
                                            ? <TrendingUp className="h-3 w-3" />
                                            : <TrendingDown className="h-3 w-3" />
                                        }
                                        {trend.isUpward ? "+" : "-"}{Math.abs(trend.value)}%
                                    </span>
                                )}
                                {description && (
                                    <span className="text-xs text-muted-foreground">{description}</span>
                                )}
                            </div>
                        )}
                    </div>
                    <div className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ml-3",
                        colorMap[color]
                    )}>
                        <Icon className="h-5 w-5" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
