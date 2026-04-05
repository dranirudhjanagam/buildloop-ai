import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are a world-class startup strategist. You will receive a startup idea, the founder's conversation with a validation expert, the original validation report sections, and scores.

Your job is to analyze weaknesses (low scores, high risks, unclear positioning) and generate an IMPROVED version of the idea.

Return a JSON object with this exact structure:
{
  "improvements": [
    { "title": "Problem Statement", "original_summary": "Brief summary of original", "improved": "Full improved version", "change_reason": "Why this is better" },
    { "title": "Target Market", "original_summary": "Brief summary of original", "improved": "Full improved version", "change_reason": "Why this is better" },
    { "title": "MVP Idea", "original_summary": "Brief summary of original", "improved": "Full improved version", "change_reason": "Why this is better" },
    { "title": "Differentiation", "original_summary": "Brief summary of original", "improved": "Full improved version", "change_reason": "Why this is better" },
    { "title": "Growth Strategy", "original_summary": "Brief summary of original", "improved": "Full improved version", "change_reason": "Why this is better" }
  ],
  "score_prediction": {
    "problem_clarity": <1-10>,
    "market_need": <1-10>,
    "feasibility": <1-10>,
    "risk_level": "Low" | "Medium" | "High",
    "overall_score": <0-100>
  }
}

Be specific, actionable, and realistic. Each improvement should directly address a weakness from the original analysis.
Return ONLY valid JSON, no markdown.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { idea, conversation, sections, scores } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const userPrompt = `Startup Idea: ${idea}

Conversation with validation expert:
${JSON.stringify(conversation)}

Original Report Sections:
${JSON.stringify(sections)}

Original Scores:
${JSON.stringify(scores)}

Analyze the weaknesses and generate improved versions. Return JSON only.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
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
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("No content in AI response");

    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("improve-idea error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
