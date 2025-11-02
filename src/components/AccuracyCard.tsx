import { Card } from "@/components/ui/card";
import { Target, TrendingUp, TrendingDown } from "lucide-react";

interface AccuracyCardProps {
  accuracy?: number;
  hasData: boolean;
}

const AccuracyCard = ({ accuracy, hasData }: AccuracyCardProps) => {
  if (!hasData) {
    return null;
  }

  const getAccuracyColor = (acc: number) => {
    if (acc >= 90) return "text-green-500";
    if (acc >= 80) return "text-yellow-500";
    if (acc >= 70) return "text-orange-500";
    return "text-red-500";
  };

  const getAccuracyIcon = (acc: number) => {
    if (acc >= 80) return <TrendingUp className="w-4 h-4" />;
    return <TrendingDown className="w-4 h-4" />;
  };

  const getAccuracyStatus = (acc: number) => {
    if (acc >= 90) return "Excellent";
    if (acc >= 80) return "Good";
    if (acc >= 70) return "Fair";
    return "Needs Improvement";
  };

  return (
    <Card className="p-6 bg-card/60 backdrop-blur-xl border-border/50 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-glow)] transition-all duration-300 animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
          <Target className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            System Accuracy
          </h3>
          <p className="text-xs text-muted-foreground">Prediction reliability</p>
        </div>
      </div>
      
      <div className="space-y-3">
        {accuracy !== undefined ? (
          <>
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl font-bold ${getAccuracyColor(accuracy)}`}>
                {accuracy.toFixed(1)}
              </span>
              <span className="text-lg text-muted-foreground">%</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              {getAccuracyIcon(accuracy)}
              <span className={`font-medium ${getAccuracyColor(accuracy)}`}>
                {getAccuracyStatus(accuracy)}
              </span>
            </div>
            
            <div className="w-full bg-muted/30 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  accuracy >= 90 ? 'bg-green-500' :
                  accuracy >= 80 ? 'bg-yellow-500' :
                  accuracy >= 70 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(accuracy, 100)}%` }}
              />
            </div>
          </>
        ) : (
          <div className="text-center text-muted-foreground">
            <p className="text-sm">Accuracy data not available</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AccuracyCard;
