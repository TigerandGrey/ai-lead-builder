"use server";

import OpenAI from "openai";
import { serverConfig } from "../server-config";

export async function createOpenAiClient() {
  return new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: serverConfig.openaiKey,
  });
}
