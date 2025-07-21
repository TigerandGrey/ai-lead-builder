import { NextResponse } from "next/server";
import { createOpenAiClient } from "@/lib/openai/client";

export async function POST(req: Request) {
  try {
    const { name, role, company } = await req.json();

    const openai = await createOpenAiClient();
    const prompt = `Write a short, friendly LinkedIn outreach message to ${name}, who is a ${role} at ${company}. Make it casual and under 500 characters.`;

    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-3.3-70b-instruct:free",
      messages: [{ role: "user", content: prompt }],
      // max_tokens: 400,
    });

    return NextResponse.json({
      message: completion.choices[0].message.content,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Message generation failed",
        details: error,
      },
      { status: 500 }
    );
  }
}
