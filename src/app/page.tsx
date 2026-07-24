import UpperHeroSection from "../components/landingPage/UpperHeroSection";
import MaxWidthWrapper from "../components/landingPage/MaxWidthWrapper";
import Navbar from "../components/landingPage/Navbar";
import LowerHeroSection from "../components/landingPage/LowerHeroSection";
import Features from "../components/landingPage/Features";
import HowItWorks from "../components/landingPage/HowItWorks";
import Transactions from "../components/landingPage/Transactions";
import Testimonials from "../components/landingPage/Testimonials";
import Footer from "../components/landingPage/Footer";

export default function Home() {
  return (
    <div className="bg-background">
      <Navbar></Navbar>
      <MaxWidthWrapper className="mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center">
        <UpperHeroSection />
        <LowerHeroSection />
        <Features />
      </MaxWidthWrapper>
      <HowItWorks />
      <Transactions />
      <Testimonials />
      <Footer />
    </div>
  );
}
