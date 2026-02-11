import NextAuth, { type DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authApi } from "./lib/api";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    tokenExpiry?: string;
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role?: string;
      businessId?: string;
      userProfile?: any;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role?: string;
    businessId?: string;
    accessToken?: string;
    tokenExpiry?: string;
    userProfile?: any;
  }

  interface JWT {
    id: string;
    accessToken?: string;
    role?: string;
    businessId?: string;
    tokenExpiry?: string;
    userProfile?: any;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("🔐 Authorize called with:", { 
          username: credentials?.username, 
          hasPassword: !!credentials?.password 
        });

        if (!credentials?.username || !credentials?.password) {
          console.error("❌ Missing credentials");
          throw new Error("Invalid credentials");
        }

        try {
          console.log("📡 Calling API login...");
          const response = await authApi.login({
            username: credentials.username as string,
            password: credentials.password as string,
          });

          console.log("✅ Login successful!");

          if (response.status === "success" && response.payload) {
            const { token, tokenExpiry, userProfile } = response.payload;
            return {
              id: userProfile.id,
              email: userProfile.email || "",
              firstName: userProfile.firstname || "User",
              lastName: userProfile.lastname || "",
              name: `${userProfile.firstname || "User"} ${userProfile.lastname || ""}`.trim(),
              role: userProfile.category || undefined,
              businessId: userProfile.identityId || undefined,
              accessToken: token,
              tokenExpiry,
              userProfile: userProfile, // Store full user profile
            };
          }

          console.error("❌ Invalid response format");
          return null;
        } catch (error) {
          console.error("❌ Auth error details:", error);
          if (error instanceof Error) {
            console.error("Error message:", error.message);
            throw new Error(error.message);
          }
          throw new Error("Invalid username or password");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accessToken = user.accessToken;
        token.role = user.role;
        token.businessId = user.businessId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.accessToken = token.accessToken as string | undefined;
        session.user.role = token.role as string | undefined;
        session.user.businessId = token.businessId as string | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
