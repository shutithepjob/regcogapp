import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({auth, request: {nextUrl}}){
            const isLoggedIn = !!auth?.user;
            const isOnMain = nextUrl.pathname.startsWith("/main");

            if (isOnMain) {
                if (isLoggedIn) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    },
    session: {strategy: "jwt"},
    providers: [
        Credentials({}),
    ],
}satisfies NextAuthConfig;