import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

type ColorTheme = "blue" | "emerald" | "amber" | "red" | "purple" | "orange"

interface PremiumStatCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  colorTheme?: ColorTheme
  trend?: React.ReactNode
  criticalAlert?: boolean
}

export function PremiumStatCard({
  title,
  value,
  description,
  icon: Icon,
  colorTheme = "blue",
  trend,
  criticalAlert = false,
}: PremiumStatCardProps) {
  const themeStyles = {
    blue: {
      border: "border-blue-200/50 dark:border-blue-800/50",
      gradient: "from-blue-500/5",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600 dark:text-blue-400",
      valueColor: "text-foreground",
    },
    emerald: {
      border: "border-emerald-200/50 dark:border-emerald-800/50",
      gradient: "from-emerald-500/5",
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      valueColor: "text-emerald-600 dark:text-emerald-400",
    },
    amber: {
      border: "border-amber-200/50 dark:border-amber-800/50",
      gradient: "from-amber-500/5",
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-600 dark:text-amber-400",
      valueColor: "text-amber-500",
    },
    red: {
      border: "border-red-500/20 dark:border-red-500/20 shadow-sm shadow-red-500/5",
      gradient: "from-red-500/10",
      iconBg: "bg-red-500/15",
      iconColor: "text-red-600 dark:text-red-400",
      valueColor: "text-red-600 dark:text-red-500",
    },
    purple: {
      border: "border-purple-200/50 dark:border-purple-800/50",
      gradient: "from-purple-500/5",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-600 dark:text-purple-400",
      valueColor: "text-purple-600 dark:text-purple-400",
    },
    orange: {
      border: "border-orange-200/50 dark:border-orange-800/50",
      gradient: "from-orange-500/5",
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-600 dark:text-orange-400",
      valueColor: "text-orange-500",
    },
  }

  const currentTheme = themeStyles[colorTheme]

  return (
    <Card className={cn("relative overflow-hidden group hover:shadow-lg transition-all duration-300", currentTheme.border)}>
      <div className={cn("absolute inset-0 bg-gradient-to-br via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500", currentTheme.gradient, criticalAlert ? "opacity-100" : "")} />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
        <CardTitle className="text-sm font-semibold text-muted-foreground">{title}</CardTitle>
        <div className={cn("p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-300 relative", currentTheme.iconBg, currentTheme.iconColor)}>
          <Icon className="size-4" />
          {criticalAlert && (
            <>
              <span className="absolute -top-1 -right-1 size-2.5 bg-red-500 rounded-full animate-ping" />
              <span className="absolute -top-1 -right-1 size-2.5 bg-red-500 rounded-full" />
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className={cn("text-3xl font-black tracking-tight", currentTheme.valueColor)}>
          {value}
        </div>
        {trend && (
          <div className="mt-1">{trend}</div>
        )}
        {description && (
          <p className="text-xs font-medium text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}
