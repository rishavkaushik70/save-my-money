import FeaturesCard from "./FeaturesCard";

const Features = () => {
  return (
    <section id="features" className="landing-section">
      <div className="landing-container mx-auto">
        <div className="mb-10 flex flex-col items-start gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="landing-eyebrow mb-3">Made for your everyday</p>
            <h2 className="landing-section-title max-w-[580px]">Everything you need for a clearer money picture.</h2>
          </div>
          <p className="landing-muted max-w-[360px] text-sm leading-6 sm:pb-1">
            Small, useful insights that help you feel more in control of your finances.
          </p>
        </div>
        <FeaturesCard />
      </div>
    </section>
  );
};

export default Features;
