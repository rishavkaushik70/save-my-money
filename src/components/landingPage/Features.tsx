import FeaturesCard from "./FeaturesCard";

const Features = () => {
  return (
    <div
      id="features"
      className="flex items-center justify-center flex-col mt-15 gap-3 mx-auto"
    >
      <h1 className="font-extrabold">Why SaveMyMoney?</h1>
      <p className="text-gray-500 text-sm font-semibold">
        Everything you need to manage your finances smarter
      </p>

      <FeaturesCard />
    </div>
  );
};

export default Features;
