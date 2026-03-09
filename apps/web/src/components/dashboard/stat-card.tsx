import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import React from "react";

interface StatCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon?: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    className?: string;
}

export function StatCard({ title, value, description, icon, trend, className }: StatCardProps) {
    return (
        <Card className={cn("overflow-hidden flex flex-col justify-between", className)}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {title}
                </CardTitle>
                {icon && <div className="text-slate-400">{icon}</div>}
            </CardHeader>
            <CardContent>
                <div className="flex items-baseline gap-2">
                    <div className="text-3xl font-bold tracking-tight">{value}</div>
                    {trend && (
                        <div className={cn(
                            "text-xs font-semibold px-1 rounded-sm",
                            trend.isPositive ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        )}>
                            {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
                        </div>
                    )}
                </div>
                {description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {description}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
