import { Octokit } from "octokit";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  const octokit = new Octokit({
    auth: process.env.GH_PAT,
  });
  const username = process.env.GH_USER;
  const repo = process.env.GH_REPO;
  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 },
    );
  }
  try {
    const labels = await octokit.request("GET /repos/{owner}/{repo}/labels", {
      owner: username,
      // @ts-ignore erroneous type error (to be fixed)
      repo: repo,
      // headers: {
      //   'X-GitHub-Api-Version': '2022-11-28'
      // }
    });
    return NextResponse.json(
      { labels },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("GitHub API error:", error);

    let errorMessage = "An unexpected error occurred";
    let statusCode = 500;

    if (error instanceof Error && error.message.includes("Bad credentials")) {
      errorMessage = "Invalid GitHub credentials";
      statusCode = 401;
    } else if (error instanceof Error && error.message.includes("Not Found")) {
      errorMessage = "Repository not found";
      statusCode = 404;
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
