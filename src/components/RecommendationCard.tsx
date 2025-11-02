import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { getHotTake } from "@/lib/openrouter";
import { Sparkles, Loader2 } from "lucide-react";

interface RecommendationCardProps {
  hasData: boolean;
}

const RecommendationCard = ({ hasData }: RecommendationCardProps) => {
  const [recommendation, setRecommendation] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (hasData) {
      generateRecommendation();
    }
  }, [hasData]);

  const generateRecommendation = async () => {
    setIsLoading(true);
    try {
      const analysisPrompt = "Analyze this inventory demand forecast data and provide a concise 1-2 line recommendation for inventory management. Focus on key insights and actionable advice.";
      const response = await getHotTake(analysisPrompt);
      setRecommendation(response);
    } catch (error) {
      console.error("Failed to generate recommendation:", error);
      setRecommendation("Unable to generate recommendation at this time. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasData) {
    return null;
  }

  return (
    <Card className="p-6 bg-card/60 backdrop-blur-xl border-border/50 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-glow)] transition-all duration-300 animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            AI Recommendation
          </h3>
          <p className="text-xs text-muted-foreground">Based on forecast analysis</p>
        </div>
      </div>
      
      <div className="min-h-[60px] flex items-center">
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Analyzing data...</span>
          </div>
        ) : (
          <p className="text-sm leading-relaxed text-foreground">
            {recommendation || "No recommendation available"}
          </p>
        )}
      </div>
    </Card>
  );
};

export default RecommendationCard;
