import LandingThemeProvider from "@/components/landing/LandingThemeProvider";

export default function AuthRouteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <LandingThemeProvider>{children}</LandingThemeProvider>;
}
