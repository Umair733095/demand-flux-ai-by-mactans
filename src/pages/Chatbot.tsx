import { useState, useEffect, useRef } from "react";
import { Send, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Sidebar from "@/components/Sidebar";
import { supabase } from "@/integrations/supabase/client";
import { getHotTake } from "@/lib/openrouter";

const chartData = [
  { time: "W1", value: 400 },
  { time: "W2", value: 380 },
  { time: "W3", value: 420 },
  { time: "W4", value: 390 },
  { time: "W5", value: 410 },
];

const aiMessages = [
  {
    text: "Based on your historical data, I've analyzed demand patterns for the past 4 weeks.",
    isBot: true,
  },
  {
    text: "Your current inventory level of 420 units is optimal for the next week. However, I recommend reordering by Thursday to maintain a 95% service level.",
    isBot: true,
  },
  {
    text: "Expected demand spike in Week 6 (+5%) suggests increasing buffer stock by 30 units.",
    isBot: true,
  },
];

const Chatbot = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState(aiMessages);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      }
    });
  }, [navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
const LOCAL_STORAGE_KEY = "nexora_forecast_data";

// Retrieve data
const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);

// Parse it (since it's usually stored as JSON)
const forecastData = storedData ? JSON.parse(storedData) : null;

// Now you can use forecastData
console.log(forecastData);

 const handleSend = async () => {
  if (!input.trim()) return;

  setMessages([...messages, { text: input, isBot: false }]);
  setInput("");

  // ✅ Retrieve and parse localStorage data safely
  const LOCAL_STORAGE_KEY = "nexora_forecast_data";
  const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
  const forecastData = storedData ? JSON.parse(storedData) : null;

  // ✅ Convert it to a readable JSON string for API
  const forecastString = forecastData ? JSON.stringify(forecastData, null, 2) : "No forecast data available";

  // ✅ Send both user question + data to AI
  const prompt = `
  Here is the forecast data: 
  ${forecastString}

  User question:
  ${input}
  `;

  const reply = await getHotTake(prompt);

  setMessages((prev) => [...prev, { text: reply, isBot: true }]);
};


  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const autoGrow = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-foreground flex">
      <Sidebar />

      {/* Main area */}
      <div className="flex-1 ml-64 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-3xl animate-pulse-slow" />
        </div>

        <main className="relative z-10 container mx-auto px-6 py-10 max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-2xl bg-primary/20 text-primary">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                AI Inventory Assistant
              </h1>
              <p className="text-sm text-muted-foreground mt-1">Forecast • Analyze • Recommend</p>
            </div>
          </div>

          {/* Chart Section */}
          <Card className="p-6 mb-8 bg-card/70 backdrop-blur-xl border border-primary/20 shadow-[0_0_25px_-10px_hsl(var(--primary))] transition hover:shadow-[0_0_40px_-10px_hsl(var(--primary))]">
            <h2 className="text-lg font-semibold mb-4 text-primary/90">Demand Overview</h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Chat Section */}
          <Card className="p-6 bg-card/70 backdrop-blur-xl border border-border/40 shadow-[0_0_30px_-12px_hsl(var(--primary))]">
            <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/50 pr-2">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.isBot ? "justify-start" : "justify-end"} animate-fade-in`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    className={`relative max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed transition-all ${
                      message.isBot
                        ? "bg-gradient-to-r from-slate-800/80 to-slate-700/80 text-foreground border border-primary/20 shadow-md"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex items-end gap-3 rounded-xl bg-muted/20 px-4 py-2 border border-border/30 transition-all" >
  <Textarea 
    value={input}
    onChange={(e) => {
      setInput(e.target.value);
      autoGrow(e);
    }}
    onKeyDown={handleTextareaKeyDown}
    placeholder="Ask anything about your inventory or forecast..."
    className="
      flex-1 bg-transparent resize-none border-0 p-0 
      focus:outline-none focus:ring-0 focus-visible:ring-0 
      focus-visible:ring-offset-0 shadow-none 
      max-h-32 text-sm leading-6 placeholder:text-muted-foreground/70
    "
    rows={1}
  />
  <Button
    onClick={handleSend}
    disabled={!input.trim()}
    size="icon"
    className="rounded-full h-8 w-8 bg-gradient-to-r from-primary to-cyan-500 hover:opacity-90 transition-all disabled:opacity-50"
  >
    <Send className="w-4 h-4" />
  </Button>
</div>
<p className="mt-2 text-[11px] text-muted-foreground/60 text-right">
  Press <kbd>Enter</kbd> to send • <kbd>Shift + Enter</kbd> for newline
</p>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Chatbot;
