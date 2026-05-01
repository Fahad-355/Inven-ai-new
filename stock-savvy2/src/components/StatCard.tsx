import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  iconClassName?: string;
}

export function StatCard({ title, value, subtitle, icon: Icon, iconClassName }: StatCardProps) {
  return (
    <div className="bg-card rounded-xl p-5 shadow-card border border-border/50 animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[13px] font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tracking-tight text-card-foreground">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${iconClassName || "bg-accent text-accent-foreground"}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
