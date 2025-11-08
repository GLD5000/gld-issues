import type {
    GetServerSidePropsContext,
    NextApiRequest,
    NextApiResponse,
} from 'next';
import type { NextAuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

// You'll need to import and pass this
// to `NextAuth` in `app/api/auth/[...nextauth]/route.ts`
export const configNextAuth = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
    ], // rest of your config
} satisfies NextAuthOptions;

// Use it in server contexts
export function authServerNextAuth(
    ...args:
        | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
        | [NextApiRequest, NextApiResponse]
        | []
) {
    return getServerSession(...args, configNextAuth);
}

export async function showLoginPage() {
    let shouldShowLogin = true;
    const isProduction = process.env.NODE_ENV === 'production';
    const auth = await authServerNextAuth();
    const email = auth?.user?.email || null;
    const isDev =
        email === process.env.DEV_EMAIL_A || email === process.env.DEV_EMAIL_B;
    const isAuthorised =
        isDev ||
        email?.split('@')[1] === process.env.AUTH_EMAIL_DOMAIN ||
        email === process.env.AUTH_EMAIL_A ||
        email === process.env.AUTH_EMAIL_B;
    const accessLevel =
        (isDev && 'dev') || (isAuthorised && 'auth') || 'public';
    if (!isProduction) shouldShowLogin = false;
    if (email && (isDev || isAuthorised)) shouldShowLogin = false;
    return { shouldShowLogin, isDev, isAuthorised, accessLevel };
}
