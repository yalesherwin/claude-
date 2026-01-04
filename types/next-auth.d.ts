import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      twitterId?: string;
      twitterHandle?: string;
    };
  }

  interface User {
    twitterId?: string;
    twitterHandle?: string;
  }
}
