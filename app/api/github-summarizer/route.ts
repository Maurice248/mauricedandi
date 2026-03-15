import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { summarizeGithubReadme } from "./chain";

type GithubSummarizerRequest = {
  apiKey?: string;
  repoUrl?: string;
  githubUrl?: string;
};

export async function POST(request: Request) {
  let body: GithubSummarizerRequest = {};
  try {
    body = (await request.json()) as GithubSummarizerRequest;
  } catch {
    body = {};
  }

  const headerApiKey = request.headers.get("x-api-key")?.trim();
  const authHeader = request.headers.get("authorization")?.trim();
  const bearerApiKey = authHeader?.toLowerCase().startsWith("bearer ")
    ? authHeader.slice(7).trim()
    : undefined;
  const bodyApiKey = body.apiKey?.trim();
  const repoUrl = body.repoUrl?.trim() || body.githubUrl?.trim();

  const apiKey = headerApiKey || bearerApiKey || bodyApiKey;

  if (!apiKey) {
    return NextResponse.json({ valid: false, error: "API key is required." }, { status: 400 });
  }
  if (!repoUrl) {
    return NextResponse.json({ valid: false, error: "repoUrl is required." }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("api_keys")
    .select("id")
    .eq("key", apiKey)
    .eq("deleted", false)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ valid: false, error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ valid: false, error: "Invalid API key." }, { status: 401 });
  }

  try {
    const readmeContent = await getGithubReadmeContent(repoUrl);
    const summaryReport = await summarizeGithubReadme(readmeContent);
    console.log(summaryReport);

    return NextResponse.json({
      valid: true,
      message: "API key validated. README summarized successfully.",
      summaryReport,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to summarize GitHub README.";
    return NextResponse.json({ valid: false, error: errorMessage }, { status: 500 });
  }
}

/**
 * Gets the content of the README.md file for a given GitHub repository URL.
 * @param repoUrl - The GitHub repository URL (e.g., 'https://github.com/user/repo')
 * @returns The content of the README.md file as a string, or throws an error if not found.
 */
export async function getGithubReadmeContent(repoUrl: string): Promise<string> {
  // Extract org/user and repo name from URL
  try {
    // Example: https://github.com/user/repo or https://github.com/user/repo/
    const match = repoUrl.match(
      /^https?:\/\/github\.com\/([^\/\s]+)\/([^\/\s]+)(?:\/|$)/
    );
    if (!match) {
      throw new Error("Invalid GitHub repository URL.");
    }
    const owner = match[1];
    const repo = match[2];

    // Try to fetch main branch README first, then fallback to master
    const branches = ["main", "master"];
    let readmeResp: Response | undefined = undefined;
    for (const branch of branches) {
      const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`;
      readmeResp = await fetch(url);
      if (readmeResp.ok) break;
      readmeResp = undefined;
    }

    if (!readmeResp || !readmeResp.ok) {
      throw new Error("README.md not found in main or master branch.");
    }

    const content = await readmeResp.text();
    return content;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    throw new Error(`Error fetching README content: ${errorMessage}`);
  }
}
