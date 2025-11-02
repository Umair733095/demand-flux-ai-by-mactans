export async function getHotTake(topic: string): Promise<string> {
  const url = "https://openrouter.ai/api/v1/chat/completions";

  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  if (!apiKey) {
    console.error("Missing OpenRouter API key. Please set VITE_OPENROUTER_API_KEY in .env");
    return "⚠️ Missing API key configuration.";
  }
  const referer = (import.meta as any).env?.VITE_SITE_URL || window.location.origin;
  const title = (import.meta as any).env?.VITE_APP_TITLE || "AI forecast analyzer";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "HTTP-Referer": referer,
    "X-Title": title,
  };
  if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;

  const body = {
    model: "deepseek/deepseek-chat-v3.1:free",
    messages: [
      {
        role: "system",
        content:
          "Act as an expert forecast analyst with experience in data-driven market prediction. Analyze the following data and provide insights, trends and future projections with reasoning.",
      },
      {
        role: "user",
        content: `Act as an expert forecast analyst with experience in data-driven market prediction. Analyze the following data and provide insights, trends and future projections with reasoning. Given inputs: ${topic}`,
      },
    ],
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const result = await response.json();
    const content = result?.choices?.[0]?.message?.content;
    if (typeof content === "string" && content.trim().length > 0) {
      return content.trim();
    }
    return "🤯 The AI went too deep and forgot what it was saying. Try again!";
  } catch (err) {
    console.error("OpenRouter API error", err);
    return "💥 The AI exploded in a cloud of sarcasm. Try again!";
  }
}


