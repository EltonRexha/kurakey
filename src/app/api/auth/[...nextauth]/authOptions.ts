import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import prisma from "../../../../../prisma/prisma";

//OAuth profile is only set once and after the user has prompted their username it is set to false

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      image: string | null;
      name: string;
      username: string;
      firstName: string;
      lastName?: string | null;
    };
    oauthProfile?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    username?: string;
    firstName?: string;
    lastName?: string | null;
    email?: string;
    picture?: string;
    oauthProfile: boolean;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      httpOptions: {
        timeout: 10000,
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials as {
          email?: string;
          password?: string;
        };

        if (!email || !password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!user?.isActive) {
          throw new Error("AccountInactive");
        }

        if (!user) {
          return null;
        }

        if (!user.password) {
          return null;
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (!passwordsMatch) {
          return null;
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const existingUser = await prisma.user.findUnique({
          where: { email: profile.email ?? "" },
        });

        if (!existingUser) {
          token.oauthProfile = true;
        } else {
          //OAuth but its login

          if (!existingUser.isActive) {
            throw new Error("AccountInactive");
          }

          token = {
            ...token,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
            email: existingUser.email,
            name: `${existingUser.firstName} ${existingUser.lastName}`,
            picture: existingUser.image || undefined,
            userId: existingUser.id,
            username: existingUser.username,
          };
        }
      } else {
        const user = await prisma.user.findUnique({
          where: { email: token.email ?? "" },
        });

        console.log(token.oauthProfile);

        if (token.oauthProfile && !user) {
          return token;
        }

        if (!user) {
          throw new Error("AccountNotFound");
        }

        if (!user?.isActive) {
          throw new Error("AccountInactive");
        }

        token = {
          ...token,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          name: `${user.firstName}  ${user.lastName}`,
          picture: user.image || undefined,
          userId: user.id,
          username: user.username,
          oauthProfile: false,
        };
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (session.user && token) {
        session.user.id = token.userId!;
        session.user.username = token.username!;
        session.user.firstName = token.firstName!;
        session.user.lastName = token.lastName!;
        session.user.image = token.picture ?? null;
        session.user.name =
          token.name ?? `${token.firstName} ${token.lastName}`;
      }

      if (token.oauthProfile) {
        session.oauthProfile = token.oauthProfile;
      }

      return session;
    },
  },

  pages: {
    signIn: "/log-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
