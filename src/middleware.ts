import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

function isDevEmail(email: string | null) {
  return email === process.env.DEV_EMAIL_A || email === process.env.DEV_EMAIL_B;
}

export async function middleware(request: NextRequest) {
  const isIssueMutationRequest =
    request.nextUrl.pathname.startsWith("/api/makeGithubIssues") &&
    (request.method === "POST" || request.method === "PATCH");

  if (!isIssueMutationRequest) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const email = typeof token?.email === "string" ? token.email : null;

  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isDevEmail(email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/makeGithubIssues/:path*"],
};
