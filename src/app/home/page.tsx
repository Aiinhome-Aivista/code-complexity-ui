"use client";

import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Footer from "@/components/layouts/Footer";
import {
  ArrowForward,
  Check,
  VerifiedUser,
  FlashOn,
  Psychology,
} from "@mui/icons-material";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef, ReactNode } from "react";
import { commonService } from "@/services/common_apiservice";

export default function HomePage() {
  const router = useRouter();
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    commonService
      .getAllPlans()
      .then((data) => {
        if (Array.isArray(data)) {
          setPlans(data);
        }
      })
      .catch((err) => console.error("Failed to fetch plans", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-neutral-800 font-sans">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 text-center">
        <ScrollReveal className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-neutral-800">
            Intelligent Analysis for <br />
            <span className="text-indigo-800">Modern Teams</span>
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Stop guessing where your technical debt lies. Get clear, actionable
            insights with our advanced heatmap visualization technology.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Button
              className="h-12 px-8 text-lg bg-indigo-700 text-neutral-50 hover:bg-indigo-800 shadow-xl shadow-indigo-900/10 rounded-full transition-all duration-300 hover:scale-[1.05] hover:shadow-indigo-500/30 hover:-translate-y-1 cursor-pointer"
              onClick={() => {
                if (useAuthStore.getState().isAuthenticated) {
                  router.push("/dashboard");
                } else {
                  router.push("/login");
                }
              }}
            >
              Start Analyzing
              <ArrowForward sx={{ fontSize: 20 }} className="ml-2" />
            </Button>
          </div>
        </ScrollReveal>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 overflow-hidden relative">
        <div className="container mx-auto max-w-6xl relative z-10">
          <ScrollReveal className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-bold text-neutral-800">
              Powerful Features
            </h2>
            <p className="text-neutral-500 max-w-xl mx-auto">
              Everything you need to maintain a healthy, scalable codebase.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            <ScrollReveal delay={100}>
              <FeatureCard
                icon={<Psychology className="text-indigo-600" fontSize="large" />}
                title="Cognitive Complexity"
                desc="Visualize which parts of your code are hardest to understand and maintain."
              />
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <FeatureCard
                icon={
                  <VerifiedUser className="text-emerald-700" fontSize="large" />
                }
                title="Security Audit"
                desc="Automated scanning for vulnerabilities and security best practices."
              />
            </ScrollReveal>
            <ScrollReveal delay={500}>
              <FeatureCard
                icon={<FlashOn className="text-amber-600" fontSize="large" />}
                title="Performance Metrics"
                desc="Identify bottlenecks and optimization opportunities instantly."
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 bg-gray-200 overflow-hidden relative">
        <div className="container mx-auto max-w-5xl relative z-10">
          <ScrollReveal className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-bold text-neutral-800">
              Simple Pricing
            </h2>
            <p className="text-neutral-500">
              Transparent plans for teams of all sizes.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8 items-start max-w-4xl mx-auto">
            {plans.length > 0 ? (
              plans.map((plan, index) => {
                const isFree = plan.name.toUpperCase() === "FREE";
                const isPro = plan.name.toUpperCase() === "PREMIUM";
                const displayName = isFree ? "Free" : isPro ? "Pro" : plan.name;
                const displayPrice = `₹${plan.price.toLocaleString()}`;

                return (
                  <ScrollReveal key={plan.id} delay={index * 200}>
                    <PricingCard
                      plan={displayName}
                      price={displayPrice}
                      desc={isFree ? "For individuals & small projects" : "For professional developers"}
                      isCurrent={isFree}
                      isHighlighted={isPro}
                      features={[
                        `${plan.max_upload_size}${plan.unit} File Support`,
                        plan.git_access ? "Git Support" : "No Git Support",
                      ]}
                    />
                  </ScrollReveal>
                );
              })
            ) : (
              // Fallback / Loading Skeleton (or default static)
              <>
                <ScrollReveal delay={100}>
                  <PricingCard
                    plan="Free"
                    price="₹0"
                    desc="For individuals & small projects"
                    isCurrent={true}
                    features={["10KB File Support", "No Git Support"]}
                  />
                </ScrollReveal>
                <ScrollReveal delay={300}>
                  <PricingCard
                    plan="Pro"
                    price="₹2,499"
                    isHighlighted
                    desc="For professional developers"
                    features={["10MB File Support", "Git Support"]}
                  />
                </ScrollReveal>
              </>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-4 overflow-hidden relative">
        <ScrollReveal className="container mx-auto max-w-3xl text-center space-y-8 z-10 relative">
          <h2 className="text-3xl font-bold text-neutral-800">About Us</h2>
          <p className="text-lg text-neutral-600 leading-relaxed">
            We are a team of engineers dedicated to solving the visibility
            problem in software development. We believe that you can't improve
            what you can't measure. Our mission is to provide crystal clear
            insights into codebase health, empowering teams to ship faster and
            with more confidence.
          </p>
        </ScrollReveal>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

function ScrollReveal({ children, className = "", delay = 0 }: { children: ReactNode, className?: string, delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-out transform-gpu ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-[0.98]"
        } ${className}`}
    >
      {children}
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="p-8 bg-gray-200/80 backdrop-blur-sm rounded-2xl border border-gray-300 transition-all duration-500 ease-out hover:-translate-y-3 hover:scale-[1.02] hover:bg-white hover:border-indigo-300 hover:shadow-[0_20px_40px_-15px_rgba(79,70,229,0.3)] group cursor-pointer relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out" />
      <div className="mb-6 p-4 bg-gray-300 rounded-xl w-fit transition-all duration-500 ease-out group-hover:scale-110 group-hover:-rotate-3 group-hover:bg-indigo-100 group-hover:text-indigo-600 relative z-10 shadow-sm group-hover:shadow-md">{icon}</div>
      <h3 className="text-xl font-bold text-neutral-800 mb-3 transition-colors duration-300 group-hover:text-indigo-900 relative z-10">{title}</h3>
      <p className="text-neutral-500 leading-relaxed relative z-10">{desc}</p>
    </div>
  );
}

function PricingCard({
  plan,
  price,
  desc,
  features,
  isHighlighted,
  isCurrent,
}: {
  plan: string;
  price: string;
  desc: string;
  features: string[];
  isHighlighted?: boolean;
  isCurrent?: boolean;
}) {
  return (
    <div
      className={`p-8 rounded-2xl border transition-all duration-500 ease-out relative group overflow-hidden hover:-translate-y-2 hover:scale-[1.02] ${isHighlighted
        ? "bg-gradient-to-b from-white to-indigo-50/40 shadow-2xl shadow-indigo-900/10 border-indigo-200 ring-4 ring-indigo-50 scale-105 hover:shadow-indigo-500/30"
        : "bg-gray-200/50 border-gray-300 hover:bg-white hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-900/10"
        }`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      {isHighlighted && (
        <div className="absolute top-0 right-0 z-10">
          <div className="bg-gradient-to-bl from-indigo-600 to-violet-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-sm">
            RECOMMENDED
          </div>
        </div>
      )}
      <h3 className="text-xl font-bold text-neutral-800 mb-2">{plan}</h3>
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-4xl font-bold text-neutral-900">{price}</span>
        {price !== "Custom" && <span className="text-neutral-500">/mo</span>}
      </div>
      <p className="text-neutral-500 text-sm mb-6">{desc}</p>
      <ul className="space-y-4 mb-8">
        {features.map((f) => (
          <li
            key={f}
            className="flex items-center gap-3 text-sm text-neutral-700"
          >
            <Check className="text-indigo-600 h-5 w-5" />
            {f}
          </li>
        ))}
      </ul>
      <Button
        variant={isHighlighted ? "default" : "outline"}
        className={`w-full h-11 text-sm font-semibold tracking-wide transition-all duration-300 ease-out group-hover:shadow-lg ${isHighlighted
          ? "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 border-0 hover:scale-[1.02]"
          : isCurrent
            ? "bg-neutral-200/80 text-neutral-500 border-neutral-300 cursor-not-allowed shadow-none"
            : "border-neutral-300 bg-white text-neutral-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-400 group-hover:bg-indigo-50 group-hover:text-indigo-700 group-hover:border-indigo-300"
          }`}
        disabled={isCurrent}
      >
        {isCurrent ? "Current Plan" : `Choose ${plan}`}
      </Button>
    </div>
  );
}
