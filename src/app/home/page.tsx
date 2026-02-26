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
  const { openPaymentModal } = useAuthStore();

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
    <div className="h-[calc(100%+4rem)] overflow-y-auto bg-gray-100 text-neutral-800 font-sans overflow-x-hidden home-scrollbar -mt-16">
      {/* Hero Section */}
      <section
        className="pt-32 pb-20 text-center relative overflow-hidden min-h-screen"
        style={{ width: "100vw", marginLeft: "calc(-50vw + 50%)" }}
      >
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 z-0"
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.70)" }}
        >
          <source src="/home-hero-bg.mp4" type="video/mp4" />
        </video>
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black/40 z-[1]" />

        <ScrollReveal className="max-w-4xl mx-auto space-y-8 relative z-10 px-4 opacity-90">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white drop-shadow-md">
            Intelligent <span className="text-indigo-300">Analysis</span> for <br />
            Modern Teams
          </h1>
          <p className="text-xl text-neutral-300 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
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

          <div className="grid md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
            {plans.length > 0 ? (
              plans.map((plan, index) => (
                <ScrollReveal key={plan.id} delay={index * 200}>
                  <PricingCard
                    plan={plan.name}
                    price={`₹${plan.price.toLocaleString()}`}
                    desc={plan.description}
                    features={[
                      `${plan.max_upload_size}${plan.Unit || plan.unit || ""} File Support`,
                      plan.git_access ? "Git Support" : "No Git Support",
                      plan.duration_days ? `${plan.duration_days} Days Validity` : "Lifetime Validity",
                    ]}
                  />
                </ScrollReveal>
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 py-12 text-center text-neutral-500">
                Loading plans...
              </div>
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
    <div className="p-8 bg-gray-200/80 backdrop-blur-sm rounded-2xl border border-gray-300 transition-all duration-500 ease-out hover:-translate-y-3 hover:scale-[1.02] hover:bg-white hover:border-indigo-300 hover:shadow-[0_20px_40px_-15px_rgba(79,70,229,0.3)] group relative overflow-hidden">
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
}: {
  plan: string;
  price: string;
  desc?: string;
  features: string[];
}) {
  return (
    <div className="h-full p-8 rounded-2xl border bg-white/70 border-gray-200 shadow-lg shadow-indigo-900/5 hover:shadow-xl hover:shadow-indigo-900/10 hover:-translate-y-1 transition-all duration-300 ease-out">
      <h3 className="text-xl font-bold text-neutral-800 mb-2">{plan}</h3>
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-4xl font-bold text-neutral-900">{price}</span>
        <span className="text-neutral-500">/mo</span>
      </div>
      {desc && <p className="text-neutral-500 text-sm mb-6">{desc}</p>}
      <ul className="space-y-3">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-3 text-sm text-neutral-700">
            <Check className="text-indigo-600 h-5 w-5 shrink-0" />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}
