import { auth } from "@/lib/auth";

export type Session = NonNullable<
  Awaited<ReturnType<typeof auth.api.getSession>>
>;

export type User = Session["user"];
