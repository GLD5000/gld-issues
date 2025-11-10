//octokit.rest.issues.update({
//     owner,
//     repo,
//     issue_number,
//   });

// octokit.rest.issues.create({
//     owner,
//     repo,
//     title,
//   });

import { Octokit } from "octokit";
import { NextResponse } from "next/server";

export async function POST(
  request: Request, //eslint-disable-line
  { params }: { params: { slug: string | undefined } },
): Promise<NextResponse> {
  const { slug } = await params;
  console.log("slug:", slug);
  // const res = await request.json();
  // const { title, body } = res;
  // const octokit = new Octokit({ auth: process.env.GH_PAT });

  // const owner = process.env.GH_USER;
  // const repo = process.env.GH_REPO;
  // if (!owner) {
  //     return NextResponse.json(
  //         { error: 'Username is required' },
  //         { status: 400 }
  //     );
  // }
  // const parameters = {
  //     owner,
  //     repo,
  //     title,
  //     body,
  //     assignees: ['GLD5000'],
  //     // milestone: 1,
  //     labels: ['todo'],
  //     headers: {
  //         'X-GitHub-Api-Version': '2022-11-28',
  //     },
  // };
  // try {
  // const response = await octokit.request(
  //     'POST /repos/{owner}/{repo}/issues',
  //     parameters
  // );

  //     return await postIssue(
  //         'POST /repos/{owner}/{repo}/issues',
  //         response
  //     );
  // } catch (error) {
  //     return handleError(error);
  // }
  return postIssue(request);
}

export async function PATCH(
  request: Request, //eslint-disable-line
  { params }: { params: { slug: string | undefined } },
): Promise<NextResponse> {
  const { slug } = await params; //erroneous TS error (Next.js Route handler update)

  if (slug && slug === "patchTodo") {
    const res = await request.json();
    return await patchIssue(res);
  } else if (slug && slug === "close") {
    const res = await request.json();
    const { issue_number, current_state } = res;
    return await patchIssue({
      state: current_state !== "closed" ? "closed" : "open",
      issue_number,
      issue: res,
    });
  } else {
    console.error("Incorrect Slug:", slug);
    return NextResponse.json({ error: "Incorrect Slug" }, { status: 400 });
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}

async function patchIssue(params: { [key: string]: any }) {
  const octokit = new Octokit({ auth: process.env.GH_PAT });

  const owner = process.env.GH_USER;
  const repo = process.env.GH_REPO;
  if (!owner) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 },
    );
  }
  console.log("params.labels:", params.labels);
  const parameters = {
    owner,
    repo,
    ...params,
    labels: splitLabels(params.labels),
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  };
  try {
    await octokit.request(
      "PATCH /repos/{owner}/{repo}/issues/{issue_number}",
      // @ts-ignore erroneous type error (to be fixed)
      parameters,
    );
    return NextResponse.json(
      { message: "Issue created successfully" },
      { status: 201 },
    );
  } catch (error) {
    return handleError(error);
  }
}

function handleError(error: Error | unknown) {
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

async function postIssue(request: Request) {
  const res = await request.json();
  if (!res) {
    return NextResponse.json(
      {
        error: "Bad Request",
      },
      { status: 400 },
    );
  }
  // const { title, body } = res;
  const octokit = new Octokit({ auth: process.env.GH_PAT });

  const owner = process.env.GH_USER;
  const repo = process.env.GH_REPO;
  if (!owner) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 },
    );
  }
  const parameters = {
    ...res,
    owner,
    repo,
    labels: splitLabels(res.labels),
    assignees: ["GLD5000"],
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  };
  try {
    const response = await octokit.request(
      "POST /repos/{owner}/{repo}/issues",
      parameters,
    );

    const issue = response.data;

    return NextResponse.json(
      { message: "Issue created successfully", issue },
      { status: 201 },
    );
  } catch (error) {
    return handleError(error);
  }
}
function splitLabels(labels: string | undefined) {
  return labels ? labels.split(",") : undefined;
}
