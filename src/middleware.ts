import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

function isDevEmail(email: string | null) {
  return email === process.env.DEV_EMAIL_A || email === process.env.DEV_EMAIL_B;
}

function getEmailFromToken(token: Awaited<ReturnType<typeof getToken>>) {
  if (!token || typeof token === "string") return null;

  const tokenRecord = token as Record<string, unknown>;

  const claimCandidates = [
    tokenRecord.email,
    tokenRecord.preferred_username,
    tokenRecord.upn,
  ];

  for (const candidate of claimCandidates) {
    if (typeof candidate === "string" && candidate.includes("@")) {
      return candidate;
    }
  }

  const userClaim = tokenRecord.user;
  if (
    userClaim &&
    typeof userClaim === "object" &&
    "email" in userClaim &&
    typeof userClaim.email === "string"
  ) {
    return userClaim.email;
  }

  return null;
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
  const email = getEmailFromToken(token);

  if (!email) {
    return NextResponse.json(
      {
        error:
          "Unauthorized - no email claim found. Check NEXTAUTH_SECRET and JWT callbacks in production.",
      },
      { status: 401 },
    );
  }

  if (!isDevEmail(email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/makeGithubIssues/:path*"],
};
