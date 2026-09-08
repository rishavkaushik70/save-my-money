import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import HeaderClient from "./HeaderClient";

const Header = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  return <HeaderClient user={user} />;
};

export default Header;
