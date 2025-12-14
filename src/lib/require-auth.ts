import { getServerSession } from "next-auth";
import { AuthOptions } from "./auth";
import { redirect } from "next/navigation";

export async function requireAuth() {
  const session = await getServerSession(AuthOptions);
  if (!session) redirect("/login");
  return session;
}
