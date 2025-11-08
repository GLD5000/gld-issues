# GLD-Issues
An interface that allows you to easily create and manage GitHub Issues for your projects or use GitHub Issues as a project management tool

## To create from scratch

1. Create a repo on GitHub using lowercase letters for the name
2. Clone locally or in codespaces
3. [Create Next App](https://nextjs.org/docs/app/getting-started)

```
npx create-next-app@latest
```
4. [Add NextAuth](https://next-auth.js.org/getting-started/example)

```
npm install next-auth
```
5. Create API Route: `/app/api/auth/[...nextauth]/route.ts` e.g.:

```
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from 'next-auth/providers/google';

const configNextAuth = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
    ], // rest of your config
} satisfies NextAuthOptions;

const handler = NextAuth(configNextAuth);

export { handler as GET, handler as POST }
```
6. Add environmental variables

7. Get Google Cloud Token & Whitelist emails