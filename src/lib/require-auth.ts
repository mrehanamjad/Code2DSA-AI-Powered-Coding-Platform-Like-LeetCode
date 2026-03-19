import { getServerSession } from "next-auth";
import { AuthOptions } from "./auth";
import { redirect } from "next/navigation";


export async function serverSession() {
  return await getServerSession(AuthOptions);
}

// this function is used to protect routes
export async function requireAuth() {
  const session = await getServerSession(AuthOptions);
  if (!session) redirect("/login");
  return session;
}

// this function is used to protect admin routes
export async function requireAdminAuth() {
  const session = await getServerSession(AuthOptions);
  if (!session) redirect("/login");
  if (session.user.role !== "admin") redirect("/");
  return session;
}
