import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";

const outputSchema = {
  name: "github_readme_summary",
  strict: true,
  type: "object",
  properties: {
    summary: {
      type: "string",
      description: "A concise summary of the GitHub repository based on the README.",
    },
    cool_facts: {
      type: "array",
      items: { type: "string" },
      description: "Interesting notable facts from the README.",
    },
  },
  required: ["summary", "cool_facts"],
  additionalProperties: false,
} as const;

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    'You are a technical summarizer. Summarize this GitHub repository from this README file content. Return JSON with fields: "summary" and "cool_facts".',
  ],
  ["human", "{readmeContent}"],
]);

function createModel() {
  const openRouterApiKey = process.env.OPENROUTER_API_KEY?.trim();
  const openAiApiKey = process.env.OPENAI_API_KEY?.trim();

  if (openRouterApiKey) {
    return new ChatOpenAI({
      model: process.env.OPENROUTER_MODEL?.trim() || "openai/gpt-4o-mini",
      temperature: 0.2,
      apiKey: openRouterApiKey,
      configuration: {
        baseURL: "https://openrouter.ai/api/v1",
        defaultHeaders: {
          "HTTP-Referer": process.env.OPENROUTER_SITE_URL?.trim() || "http://localhost:3000",
          "X-Title": process.env.OPENROUTER_APP_NAME?.trim() || "maurice-github-summarizer",
        },
      },
    });
  }

  if (openAiApiKey) {
    return new ChatOpenAI({
      model: "gpt-4o-mini",
      temperature: 0.2,
      apiKey: openAiApiKey,
    });
  }

  throw new Error("Missing OPENROUTER_API_KEY (or OPENAI_API_KEY) environment variable.");
}

export async function summarizeGithubReadme(readmeContent: string) {
  const model = createModel();
  const structuredModel = model.withStructuredOutput(outputSchema);
  const runnable = prompt.pipe(structuredModel);
  const report = await runnable.invoke({ readmeContent });
  return report;
}
