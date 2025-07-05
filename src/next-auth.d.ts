import NextAuth, { DefaultSession } from "next-auth";

// What does this do?
// It augments (extends) the Session interface from next-auth to include your custom isAdmin on session.user.
// This means everywhere you use session.user.isAdmin, TypeScript will recognize it.

declare module "next-auth" {
  interface Session {
    user: {
      isAdmin?: boolean;
    } & DefaultSession["user"];
  }
}
