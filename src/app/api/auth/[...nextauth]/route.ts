import NextAuth from "next-auth/next";
import { configNextAuth } from "../../../../auth/auth";

const handler = NextAuth(configNextAuth);

export { handler as GET, handler as POST };
