"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Star, CheckCircle2, Pause, Play, Sparkles } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  initials: string;
  tag: string;
  quote: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    name: "Ankit Sharma",
    role: "Freelancer • Bengaluru",
    initials: "AS",
    tag: "Saved ₹18,500/mo",
    quote:
      "SaveMyMoney helped me save ₹18,500 in my very first month. The automated categorization and AI spending alerts stopped my impulsive late-night shopping.",
    rating: 5,
  },
  {
    name: "Priya Verma",
    role: "Product Lead • Gurugram",
    initials: "PV",
    tag: "Zero spreadsheet stress",
    quote:
      "Finally, a personal finance app that doesn't feel like a boring tax spreadsheet. The dark mode is sleek and the goal visualizer keeps me locked in.",
    rating: 5,
  },
  {
    name: "Rohit Mehta",
    role: "Software Architect • Pune",
    initials: "RM",
    tag: "Found ₹4,200 in idle subs",
    quote:
      "The dashboard is gorgeous and the AI recommendations are spot on. It flagged three recurring subscriptions I completely forgot I was paying for.",
    rating: 5,
  },
  {
    name: "Sneha Patel",
    role: "UI Designer • Mumbai",
    initials: "SP",
    tag: "35% savings rate achieved",
    quote:
      "The design aesthetics are easily 10/10. It takes five seconds to log a transaction, and the monthly breakdowns give me genuine clarity.",
    rating: 5,
  },
  {
    name: "Vikramaditya Rao",
    role: "Startup Founder • Hyderabad",
    initials: "VR",
    tag: "Smart budget tracking",
    quote:
      "Managing personal cashflow alongside business travel used to be total chaos. SaveMyMoney keeps everything organized without any friction.",
    rating: 5,
  },
  {
    name: "Tanya Deshmukh",
    role: "Content Creator • New Delhi",
    initials: "TD",
    tag: "Goal hit in 45 days",
    quote:
      "I reached my emergency fund target 2 months earlier than planned. Watching the progress bar fill up every week was the exact dopamine boost I needed.",
    rating: 5,
  },
];

const Testimonials = () => {
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate list to achieve a seamless, continuous infinite loop
  const marqueeItems = [...testimonials, ...testimonials];

  return (
    <section id="testimonial" className="landing-section scroll-mt-20 overflow-hidden pb-12 sm:pb-20">
      <div className="landing-container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <div className="landing-eyebrow mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold">
              <Sparkles className="size-3.5" />
              <span>Money, made more manageable</span>
            </div>
            <h2 className="landing-section-title">A little more peace of mind.</h2>
            <p className="landing-muted mt-2 max-w-xl text-sm sm:text-base">
              Real experiences from people building stronger money habits, saving smarter, and staying in control.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="landing-surface landing-border inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium">
              <span className="landing-stars flex items-center gap-0.5" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star key={index} className="size-3.5 fill-current" />
                ))}
              </span>
              <span className="font-semibold text-foreground">4.9/5</span>
              <span className="landing-muted hidden xs:inline">• Loved by 2,500+ savers</span>
            </div>

            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              aria-label={isPaused ? "Resume reviews slider" : "Pause reviews slider"}
              className="landing-surface landing-border landing-muted hover:text-foreground inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors"
            >
              {isPaused ? (
                <>
                  <Play className="size-3 fill-current" />
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <Pause className="size-3 fill-current" />
                  <span>Pause</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Modern horizontal sliding marquee container with gradient edge masks */}
      <div className="reviews-marquee-container relative w-full overflow-hidden py-3">
        <div className="reviews-mask relative w-full overflow-hidden">
          <div
            className="reviews-marquee-track flex gap-5 py-2 pl-4 sm:gap-6 sm:pl-6"
            style={{ animationPlayState: isPaused ? "paused" : undefined }}
          >
            {marqueeItems.map((testimonial, idx) => (
              <motion.figure
                key={`${testimonial.name}-${idx}`}
                whileHover={{ y: -6, scale: 1.015 }}
                transition={{ type: "spring", stiffness: 380, damping: 26 }}
                className="testimonial-card landing-surface landing-border flex h-full w-[310px] shrink-0 flex-col justify-between rounded-[24px] border p-6 sm:w-[380px] sm:p-7 md:w-[410px]"
              >
                <div>
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <div className="landing-stars flex items-center gap-1" aria-hidden="true">
                      {Array.from({ length: testimonial.rating }, (_, i) => (
                        <Star key={i} className="size-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="landing-avatar inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide">
                      {testimonial.tag}
                    </span>
                  </div>

                  <blockquote className="text-[14px] leading-relaxed tracking-[-0.01em] sm:text-[15px] sm:leading-7">
                    “{testimonial.quote}”
                  </blockquote>
                </div>

                <figcaption className="mt-6 flex items-center gap-3 border-t border-border/40 pt-4">
                  <span className="landing-avatar flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-xs">
                    {testimonial.initials}
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="flex items-center gap-1.5 truncate text-sm font-semibold">
                      {testimonial.name}
                      <CheckCircle2 className="size-3.5 shrink-0 text-primary" aria-label="Verified user" />
                    </span>
                    <span className="landing-muted truncate text-xs">{testimonial.role}</span>
                  </div>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
