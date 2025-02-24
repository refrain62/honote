import NextAuth from "next-auth";
import Github
impot { prisma } from "./lib/github";
import { PrismaAdapter } from "@auth/prisma-adapter"; 

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Github],
})
