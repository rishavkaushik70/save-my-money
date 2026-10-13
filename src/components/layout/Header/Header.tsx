import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getUserEntitlements } from "@/lib/subscriptions/entitlements";
import HeaderClient from "./HeaderClient";

const Header = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;
  const entitlements = session ? await getUserEntitlements(session.user.id) : null;

  return <HeaderClient user={user} tier={entitlements?.tier ?? "FREE"} />;
};

export default Header;
