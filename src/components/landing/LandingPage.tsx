import MaxWidthWrapper from "./MaxWidthWrapper";
import Testimonials from "./Testimonials/Testimonials";
import Navbar from "./Navbar/Navbar";
import Features from "./Features/Features";
import Footer from "./Footer/Footer";
import Hero from "./Hero/Hero";
import DashboardPreview from "./DashboardPreview/DashboardPreview";
import AiFeature from "./Ai-Feature-Highlight/AiFeature";
import Pricing from "./Pricing/Pricing";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground mb-3">
      <Navbar />

      <MaxWidthWrapper className="mb-12 mt-28 flex flex-col items-center justify-center text-center sm:mt-40">
        <Hero />
        <Features />
      </MaxWidthWrapper>

      <DashboardPreview />
      <AiFeature />
      <Pricing />
      <Testimonials />
      <Footer />
    </div>
  );
}
