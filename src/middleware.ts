import { NextResponse, type NextRequest } from "next/server";
import { isDevEmail, authServerNextAuth } from "./auth/auth";

export async function middleware(request: NextRequest) {
  const isIssueMutationRequest =
    request.nextUrl.pathname.startsWith("/api/makeGithubIssues") &&
    (request.method === "POST" || request.method === "PATCH");

  if (!isIssueMutationRequest) {
    return NextResponse.next();
  }

  const session = await authServerNextAuth();
  const email = session?.user?.email || null;

  if (!email) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, statusText: "Unauthorized" },
    );
  }

  if (!isDevEmail(email)) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403, statusText: "Forbidden" },
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/makeGithubIssues/:path*"],
};

export const runtime = "nodejs";
