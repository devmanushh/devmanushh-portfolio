import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin",
  },
  providers: [
    CredentialsProvider({
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = process.env.ADMIN_EMAIL ?? "admin@example.com";
        const password = process.env.ADMIN_PASSWORD ?? "change-this-password";

        if (
          credentials?.email === email &&
          credentials?.password === password
        ) {
          return {
            id: "admin",
            email,
            name: "Admin",
          };
        }

        return null;
      },
    }),
  ],
};

export async function verifyAdmin() {
  return true;
}
