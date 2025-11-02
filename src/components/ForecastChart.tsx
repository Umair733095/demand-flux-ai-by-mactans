"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  Brush,
} from "recharts";

// ✅ Default fallback data
const fallbackData = {
  actual: [
    { ds: "2024-01-01", y: 155, optimal_stock: 176, profit_band: 170.97 },
    { ds: "2024-01-02", y: 149, optimal_stock: 176, profit_band: 158.36 },
    { ds: "2024-01-03", y: 158, optimal_stock: 176, profit_band: 177.28 },
    { ds: "2024-01-04", y: 168, optimal_stock: 176, profit_band: 198.29 },
  ],
  forecast: [
    {
      ds: "2025-01-01",
      yhat: 161.03,
      yhat_lower: 155.1,
      yhat_upper: 168.4,
      optimal_stock: 176,
      profit_band: 183.65,
    },
    {
      ds: "2025-01-02",
      yhat: 162.98,
      yhat_lower: 157.5,
      yhat_upper: 170.2,
      optimal_stock: 176,
      profit_band: 187.75,
    },
    {
      ds: "2025-01-03",
      yhat: 161.47,
      yhat_lower: 155.3,
      yhat_upper: 169.7,
      optimal_stock: 176,
      profit_band: 184.58,
    },
    {
      ds: "2025-01-04",
      yhat: 162.26,
      yhat_lower: 156.4,
      yhat_upper: 170.3,
      optimal_stock: 176,
      profit_band: 186.23,
    },
  ],
};

export default function ForecastChart({
  apiData,
  hasData = false,
}: {
  apiData: any;
  hasData?: boolean;
}) {
  const source = apiData || fallbackData;

  // ✅ Merge Actual + Forecast data
  const mergedData = [
    ...(source?.actual || []).map((d: any) => ({
      date: d.ds,
      actual: Number(d.y),
      forecast: null,
      lower: null,
      upper: null,
      profit_band: Number(d.profit_band),
      optimal_stock: Number(d.optimal_stock),
    })),
    ...(source?.forecast || []).map((d: any) => ({
      date: d.ds,
      actual: null,
      forecast: Number(d.yhat),
      lower: Number(d.yhat_lower),
      upper: Number(d.yhat_upper),
      profit_band: Number(d.profit_band),
      optimal_stock: Number(d.optimal_stock),
    })),
  ];

  // ✅ X-axis tick formatter for better readability
  const formatDateTick = (tick: string) => {
    const date = new Date(tick);
    if (mergedData.length > 365) {
      return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    }
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // ✅ Legend formatter
  const legendFormatter = (value: string) => (
    <span style={{ color: "hsl(var(--muted-foreground))" }}>{value}</span>
  );

  return (
    <div className={hasData ? "animate-slide-up" : ""}>
      <ResponsiveContainer width="100%" height={480}>
        <LineChart
          data={mergedData}
          margin={{ top: 20, right: 40, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />

          <XAxis
            dataKey="date"
            tickFormatter={formatDateTick}
            interval="preserveStartEnd"
            minTickGap={25}
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: "11px" }}
          />

          <YAxis
            label={{ value: "Units / Inventory", angle: -90, position: "insideLeft" }}
            domain={["auto", "auto"]}
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: "12px" }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              boxShadow: "var(--shadow-glass)",
            }}
          />

          <Legend formatter={legendFormatter} />

          {/* Confidence Band (behind lines) */}
          {/* <Area
            type="monotone"
            dataKey="upper"
            stroke="none"
            fill="rgba(59,130,246,0.08)"
            name="Confidence Upper"
          />
          <Area
            type="monotone"
            dataKey="lower"
            stroke="none"
            fill="rgba(59,130,246,0.08)"
            name="Confidence Lower"
          /> */}

          {/* Actual Demand */}
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#0070f3"
            strokeWidth={2.5}
            dot={false}
            name="Actual Demand"
            connectNulls
          />

          {/* Forecasted Demand */}
          <Line
            type="monotone"
            dataKey="forecast"
            stroke="#ff9800"
            strokeWidth={2.5}
            strokeDasharray="6 6"
            dot={false}
            name="Forecasted Demand"
            connectNulls
          />

          {/* Optimal Stock */}
          <Line
            type="monotone"
            dataKey="optimal_stock"
            stroke="#16a34a"
            strokeWidth={2.2}
            dot={false}
            name="Optimal Stock"
            connectNulls
          />

          {/* ✅ Profit Band (now white & topmost) */}
          <Line
            type="monotone"
            dataKey="profit_band"
            stroke="#ffffff"
            strokeWidth={3}
            strokeDasharray="5 5"
            dot={false}
            connectNulls
            name="Profit Band"
            isAnimationActive
          />

          {/* ✅ Scrollable zoom for long datasets */}
          {mergedData.length > 60 && (
            <Brush
              dataKey="date"
              height={25}
              stroke="#ffffff"
              fill="hsl(var(--muted)/0.1)"
            />
          )}
        </LineChart>
      </ResponsiveContainer>

      {!hasData && (
        <div className="text-center text-muted-foreground mt-8">
          <p className="text-sm">Upload your demand data to see AI-powered forecasts</p>
        </div>
      )}
    </div>
  );
}
