import { Octokit } from "octokit";
import { NextResponse } from "next/server";
import { getIsoStringFromRelativeWeekNumber } from "@/utils/dates";

export async function GET(
  request: Request, //eslint-disable-line
  { params }: { params: Promise<{ slug: string }> },
): Promise<NextResponse> {
  const { slug } = await params;
  if (!slug || slug === "tasks") {
    return await getAll();
  } else {
    console.log("slug:", slug);
    return await getTask(slug);
  }
}

export async function POST(): Promise<NextResponse> {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}

async function getAll() {
  const username = process.env.GH_USER;
  const repo = process.env.GH_REPO;
  const isoStringForClosedIssues = getIsoStringFromRelativeWeekNumber();
  console.log("isoStringForClosedIssues:", isoStringForClosedIssues);
  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 },
    );
  }
  const openParameters = {
    owner: username,
    repo,
    state: "open",
    per_page: 100,
  };
  const open = await getIssues(openParameters);
  const openResponse = await open.json();

  const closedParameters = {
    ...openParameters,
    since: isoStringForClosedIssues,
    state: "closed",
  };
  const closed = await getIssues(closedParameters);
  const closedResponse = await closed.json();
  console.log("closedResponse:", closedResponse);
  const issues = !!closedResponse.error
    ? [...openResponse.issues]
    : [...closedResponse.issues, ...openResponse.issues];
  return NextResponse.json(
    { issues },
    {
      status: 200,
    },
  );
}
async function getTask(slug: string) {
  const username = process.env.GH_USER;
  const repo = process.env.GH_REPO;
  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 },
    );
  }

  const parameters = {
    owner: username,
    repo,
    state: "all",
    per_page: 100,
    issue_number: Number(slug),
  };
  return await getSingleIssue(parameters);
}

async function getSingleIssue(parameters: {
  [key: string]: string | number | undefined;
}) {
  try {
    const url = "GET /repos/{owner}/{repo}/issues/{issue_number}";
    return await fetchSingleIssue(parameters, url);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
async function fetchSingleIssue(
  parameters: { [key: string]: string | number | undefined },
  url: string,
) {
  const octokit = new Octokit({ auth: process.env.GH_PAT });

  const response = await octokit.request(url, parameters);

  const issues = [response.data];

  return NextResponse.json(
    { issues },
    {
      status: 200,
    },
  );
}

async function getIssues(parameters: {
  [key: string]: string | number | undefined;
}) {
  try {
    const url = "GET /repos/{owner}/{repo}/issues";
    return await fetchIssuesLoop(parameters, url);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

async function fetchIssuesLoop(
  parameters: { [key: string]: string | number | undefined },
  url: string,
) {
  const octokit = new Octokit({ auth: process.env.GH_PAT });
  const issues = [];
  let totalIssues = 0;
  for await (const response of octokit.paginate.iterator(url, parameters)) {
    // do whatever you want with each response, break out of the loop, etc.
    const dataReturned = response.data;
    issues.push(...Object.values(dataReturned));
    totalIssues += dataReturned.length;
    console.log("%d issues found", totalIssues);
  }
  return NextResponse.json(
    { issues },
    {
      status: 200,
    },
  );
}
