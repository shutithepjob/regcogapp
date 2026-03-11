import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { query } from '@/lib/db';
import bcrypt from "bcryptjs";
import { authConfig } from './auth.config';

export const {handlers, signIn, signOut, auth} = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            credentials: {
                email: {
                    label: "Email",
                    type: "email"
                },
                password: {
                    label: "Password",
                    type: "password"
                },
            },
            
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const email = credentials.email as string;
                const password = credentials.password as string;

                const res = await query(
                    "SELECT * FROM users WHERE email=$1",
                    [email]
                );

                const user = res.rows[0];

                if (!user) return null;

                const isValid = await bcrypt.compare(
                    password,
                    user.password
                );

                if (!isValid) return null;

                return {
                    id: String(user.id),
                    name: user.name,
                    email: user.email
                };
            }
        })
    ],
    
});