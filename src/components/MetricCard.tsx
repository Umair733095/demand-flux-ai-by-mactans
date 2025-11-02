import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  unit: string;
  trend: string;
  highlight?: boolean;
}

const MetricCard = ({ title, value, unit, trend, highlight }: MetricCardProps) => {
  return (
    <Card 
      className={`p-6 backdrop-blur-xl border-border/50 shadow-[var(--shadow-card)] transition-all duration-300 hover:shadow-[var(--shadow-glow)] hover:-translate-y-1 ${
        highlight ? "bg-gradient-to-br from-primary/20 to-secondary/10 border-primary/30" : "bg-card/60"
      }`}
    >
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className={`text-4xl font-bold ${highlight ? "text-primary" : ""}`}>
            {value}
          </h3>
          <span className="text-lg text-muted-foreground">{unit}</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-green-600">
          <TrendingUp className="w-4 h-4" />
          <span>{trend} from last month</span>
        </div>
      </div>
    </Card>
  );
};

export default MetricCard;
