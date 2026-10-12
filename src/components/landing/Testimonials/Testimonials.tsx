import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "SaveMyMoney helped me save ₹12,000 in just one month. The AI insights are a game-changer.",
    name: "Ankit Sharma",
    role: "Freelancer",
    initials: "AS",
  },
  {
    quote: "The dashboard is beautiful and the AI recommendations are spot on. Highly recommended!",
    name: "Rohit Mehta",
    role: "Freelancer",
    initials: "RM",
  },
  {
    quote: "Finally, a finance app that is easy to use and actually helps me understand my spending.",
    name: "Priya Verma",
    role: "Product manager",
    initials: "PV",
  },
];

const Testimonials = () => {
  return (
    <section id="testimonial" className="landing-section scroll-mt-20 pb-10 sm:pb-14">
      <div className="landing-container mx-auto">
        <div className="mb-9 flex flex-col gap-3 sm:mb-11 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="landing-eyebrow mb-3">Money, made more manageable</p>
            <h2 className="landing-section-title">A little more peace of mind.</h2>
          </div>
          <div className="landing-muted inline-flex items-center gap-2 text-sm">
            <span className="landing-stars flex items-center gap-0.5" aria-label="5 out of 5 stars">
              {Array.from({ length: 5 }, (_, index) => <Star key={index} className="size-3.5 fill-current" />)}
            </span>
            Loved by people building better money habits
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <figure key={testimonial.name} className="testimonial-card landing-surface flex h-full flex-col rounded-[22px] border landing-border p-6 sm:p-7">
              <div className="landing-stars mb-5 flex items-center gap-1" aria-hidden="true">
                {Array.from({ length: 5 }, (_, index) => <Star key={index} className="size-3.5 fill-current" />)}
              </div>
              <blockquote className="flex-1 text-[15px] leading-7 tracking-[-0.01em]">“{testimonial.quote}”</blockquote>
              <figcaption className="mt-7 flex items-center gap-3">
                <span className="landing-avatar flex size-10 items-center justify-center rounded-full text-xs font-bold">{testimonial.initials}</span>
                <span className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold">{testimonial.name}</span>
                  <span className="landing-muted text-xs">{testimonial.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
