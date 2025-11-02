import { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ForecastChart from "@/components/ForecastChart";
import MetricCard from "@/components/MetricCard";
import Sidebar from "@/components/Sidebar";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import RecommendationCard from "@/components/RecommendationCard.tsx";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import {
  setHasData,
  setSelectedFile,
  setIsUploading,
  setAccuracy,
} from "@/store/dashboardSlice";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const LOCAL_STORAGE_KEY = "nexora_forecast_data";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { hasData, isUploading } = useAppSelector((state) => state.dashboard);

  const [apiData, setApiData] = useState<any>(null);
  const [localFile, setLocalFile] = useState<File | null>(null);

  // ✅ Load persisted data on mount
  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setApiData(parsed);
      dispatch(setHasData(true));
      dispatch(setAccuracy(parseFloat(parsed.model_accuracy) || 88));
      console.log("📦 Loaded persisted data from localStorage");
    }
  }, [dispatch]);

  // ✅ Supabase session check
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/auth");
    });
  }, [navigate]);

  // ✅ File Selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLocalFile(file);
    dispatch(
      setSelectedFile({
        name: file.name,
        size: file.size,
        type: file.type,
      } as any)
    );

    toast({
      title: "File selected",
      description: `${file.name} is ready to upload`,
    });
  };

  // ✅ Upload + Fetch + Save to localStorage
  const handleUpload = async () => {
    if (!localFile) return;

    dispatch(setIsUploading(true));

    toast({
      title: "Analyzing data...",
      description: "AI is processing your inventory data",
    });

    try {
      const formData = new FormData();
      formData.append("file", localFile);

      const response = await fetch(`${API_BASE_URL}/api/predict`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error(`Backend returned ${response.status}`);

      const result = await response.json();
      console.log("✅ Parsed backend response:", result);

      // ✅ Save both in state and localStorage
      setApiData(result);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(result));

      dispatch(setHasData(true));
      dispatch(setAccuracy(parseFloat(result.model_accuracy) || 88));

      toast({
        title: "Forecast Ready!",
        description: "AI analysis complete and saved locally.",
      });
    } catch (error: any) {
      console.error("❌ Upload failed:", error);
      toast({
        title: "Upload Failed",
        description: error.message || "Backend not reachable.",
        variant: "destructive",
      });
    } finally {
      dispatch(setIsUploading(false));
      setLocalFile(null);
    }
  };

  // ✅ Optional: Clear persisted data
  const clearLocalData = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setApiData(null);
    dispatch(setHasData(false));
    toast({
      title: "Cleared Data",
      description: "Local forecast data removed.",
    });
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <main className="container mx-auto px-6 py-8">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                AI-powered demand forecasting and optimization
              </p>
            </div>
            {apiData && (
              <Button
                variant="outline"
                className="text-xs text-muted-foreground hover:text-destructive hover:border-destructive/40"
                onClick={clearLocalData}
              >
                Clear Saved Data
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* === Left Side: Chart & Upload === */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6 bg-card/60 backdrop-blur-xl border-border/50 shadow-[var(--shadow-card)] animate-fade-in">
                <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  Demand Forecast & Optimization
                </h2>
                <ForecastChart hasData={hasData} apiData={apiData} />
              </Card>

              <Card className="p-8 bg-card/60 backdrop-blur-xl border-border/50 shadow-[var(--shadow-card)] animate-slide-up">
                <div className="text-center space-y-6">
                  <label htmlFor="file-upload" className="cursor-pointer group">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-[var(--shadow-glow)] group-hover:from-primary/30 group-hover:to-secondary/30">
                      <Upload className="w-10 h-10 text-primary group-hover:text-primary-foreground transition-colors" />
                    </div>
                  </label>

                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Upload Demand Data (CSV)</h3>
                    <p className="text-muted-foreground text-sm">
                      Click the icon above to select your historical demand data
                    </p>
                  </div>

                  <input
                    id="file-upload"
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleFileSelect}
                  />

                  {localFile && (
                    <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg animate-fade-in">
                      <p className="text-sm font-medium text-primary">Selected file:</p>
                      <p className="text-sm text-muted-foreground">{localFile.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {(localFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={handleUpload}
                    disabled={!localFile || isUploading}
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity disabled:opacity-50"
                    size="lg"
                  >
                    {isUploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      "Upload & Analyze with AI"
                    )}
                  </Button>
                </div>
              </Card>
            </div>

            {/* === Right Side: Metrics === */}
            <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
              {hasData && apiData ? (
                <>
                <RecommendationCard hasData={hasData}/>
                <div className="grid grid-cols-1 md:grid-cols-2 mt-4 gap-4">
                  
                  <MetricCard title="Average Demand" value={apiData.average_demand?.toFixed(2)} unit="Units"  />
                  <MetricCard title="Safety Stock" value={apiData.safety_stock?.toFixed(2)} unit="Units"  />
                  <MetricCard title="Reorder Point" value={apiData.reorder_point?.toFixed(2)} unit="Units"  />
                  <MetricCard title="Optimal Stock" value={apiData.optimal_stock?.toFixed(2)} unit="Units"  />
                  <MetricCard title="Previous Cost/Day" value={apiData.previous_cost_per_day?.toFixed(2)} unit="$"  />
                  <MetricCard title="Optimized Cost/Day" value={apiData.optimized_cost_per_day?.toFixed(2)} unit="$"  />
                  <MetricCard title="Expected Savings" value={apiData.expected_savings} trend="AI Optimization" highlight />
                  <MetricCard title="Model Accuracy" value={apiData.model_accuracy} trend="Forecast Precision" />
                  <MetricCard title="Confidence Level" value={apiData.confidence_level} trend="Prediction Reliability" />
                </div>
                </>
              ) : (
                <p className="text-muted-foreground text-sm text-center mt-4">
                  Upload data to view detailed metrics
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
