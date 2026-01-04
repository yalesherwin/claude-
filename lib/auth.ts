import { NextAuthOptions } from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: "2.0",
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
        });
        if (dbUser) {
          session.user.twitterId = dbUser.twitterId;
          session.user.twitterHandle = dbUser.twitterHandle;
        }
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "twitter" && profile) {
        const twitterProfile = profile as any;
        await prisma.user.upsert({
          where: { id: user.id },
          update: {
            twitterId: account.providerAccountId,
            twitterHandle: twitterProfile.data?.username || twitterProfile.screen_name,
            name: user.name,
            image: user.image,
          },
          create: {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            twitterId: account.providerAccountId,
            twitterHandle: twitterProfile.data?.username || twitterProfile.screen_name,
          },
        });
      }
      return true;
    },
  },
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "database",
  },
};
