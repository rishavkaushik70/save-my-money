import Testimonials from "./Testimonials/Testimonials";
import Navbar from "./Navbar/Navbar";
import Features from "./Features/Features";
import Footer from "./Footer/Footer";
import Hero from "./Hero/Hero";
import AiFeature from "./Ai-Feature-Highlight/AiFeature";
import Pricing from "./Pricing/Pricing";
import Faq from "./Faq/Faq";
import LandingThemeProvider from "./LandingThemeProvider";

export default function LandingPage() {
  return (
    <LandingThemeProvider>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <AiFeature />
        <Pricing />
        <Testimonials />
        <Faq />
      </main>
      <Footer />
    </LandingThemeProvider>
  );
}
