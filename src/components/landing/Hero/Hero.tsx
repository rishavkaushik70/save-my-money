import DashboardPreview from "../DashboardPreview/DashboardPreview";
import HeroSection from "./HeroSection/HeroSection";
import Highlights from "./HeroSection/Highlights";

const Hero = () => {
  return (
    <section id="top" className="hero-section relative overflow-hidden pb-12 pt-14 sm:pb-16 sm:pt-20 lg:pt-24">
      <div className="landing-container hero-grid mx-auto grid items-center gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12">
        <HeroSection />
        <DashboardPreview />
      </div>
      <Highlights />
    </section>
  );
};

export default Hero;
