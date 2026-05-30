import { AIProvider } from "./providers/provider.interface";
import { GeminiProvider } from "./providers/gemini.provider";
import { OpenAIProvider } from "./providers/openai.provider";
import { DeepSeekProvider } from "./providers/deepseek.provider";
import { GroqProvider } from "./providers/groq.provider";

export function getAIProvider(): AIProvider {
  const provider = process.env.AI_PROVIDER || "gemini";

  switch (provider.toLowerCase()) {
    case "openai":
      return new OpenAIProvider();
    case "deepseek":
      return new DeepSeekProvider();
    case "groq":
      return new GroqProvider();
    case "gemini":
    default:
      return new GeminiProvider();
  }
}

export { runWithRetry } from "./retry";

