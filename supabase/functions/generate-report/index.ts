import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { idea, conversation } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const prompt = `Based on this startup idea and the conversation below, generate a structured validation report.

Startup Idea: "${idea}"

Conversation:
${conversation.map((m: { role: string; content: string }) => `${m.role}: ${m.content}`).join("\n")}

Generate a JSON response with:
1. A "sections" array with exactly 5 objects, each having "title" and "content":
   - Problem Statement
   - Ideal Customer Profile
   - MVP Idea
   - Validation Plan
   - Key Risks

2. A "scores" object with:
   - problem_clarity (integer 1-10)
   - market_need (integer 1-10)
   - feasibility (integer 1-10)
   - risk_level (string: "Low", "Medium", or "High")
   - overall_score (integer 0-100)

Be specific, actionable, and realistic. Scores should honestly reflect the strength of the idea based on the conversation.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are a startup validation expert. Return ONLY valid JSON, no markdown fences." },
          { role: "user", content: prompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_report",
              description: "Generate a startup validation report with sections and scores",
              parameters: {
                type: "object",
                properties: {
                  sections: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        content: { type: "string" },
                      },
                      required: ["title", "content"],
                      additionalProperties: false,
                    },
                  },
                  scores: {
                    type: "object",
                    properties: {
                      problem_clarity: { type: "number" },
                      market_need: { type: "number" },
                      feasibility: { type: "number" },
                      risk_level: { type: "string", enum: ["Low", "Medium", "High"] },
                      overall_score: { type: "number" },
                    },
                    required: ["problem_clarity", "market_need", "feasibility", "risk_level", "overall_score"],
                    additionalProperties: false,
                  },
                },
                required: ["sections", "scores"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "generate_report" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const report = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(report), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error("Unexpected AI response format");
  } catch (e) {
    console.error("report error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
