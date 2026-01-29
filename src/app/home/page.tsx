"use client";

import { Button } from "@/components/ui/Button";
import Link from "next/link";
import {
  ArrowForward,
  Check,
  VerifiedUser,
  FlashOn,
  Psychology,
} from "@mui/icons-material";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-100 text-neutral-800 font-sans">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
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
              className="h-12 px-8 text-lg bg-indigo-700 text-neutral-50 hover:bg-indigo-800 shadow-xl shadow-indigo-900/10 rounded-full transition-all hover:scale-105 cursor-pointer"
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
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-bold text-neutral-800">
              Powerful Features
            </h2>
            <p className="text-neutral-500 max-w-xl mx-auto">
              Everything you need to maintain a healthy, scalable codebase.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Psychology className="text-indigo-600" fontSize="large" />}
              title="Cognitive Complexity"
              desc="Visualize which parts of your code are hardest to understand and maintain."
            />
            <FeatureCard
              icon={
                <VerifiedUser className="text-emerald-700" fontSize="large" />
              }
              title="Security Audit"
              desc="Automated scanning for vulnerabilities and security best practices."
            />
            <FeatureCard
              icon={<FlashOn className="text-amber-600" fontSize="large" />}
              title="Performance Metrics"
              desc="Identify bottlenecks and optimization opportunities instantly."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 bg-gray-200">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-bold text-neutral-800">
              Simple Pricing
            </h2>
            <p className="text-neutral-500">
              Transparent plans for teams of all sizes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-start">
            <PricingCard
              plan="Starter"
              price="$0"
              desc="For open source projects"
              features={[
                "Public Repos Only",
                "Basic Heatmaps",
                "Community Support",
              ]}
            />
            <PricingCard
              plan="Pro"
              price="$29"
              isPopular
              desc="For growing teams"
              features={[
                "Private Repos",
                "Advanced Security",
                "Priority Support",
                "API Access",
              ]}
            />
            <PricingCard
              plan="Enterprise"
              price="Custom"
              desc="For large organizations"
              features={[
                "SSO / SAML",
                "On-Premise",
                "Dedicated Manager",
                "SLA Assurance",
              ]}
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-4">
        <div className="container mx-auto max-w-3xl text-center space-y-8">
          <h2 className="text-3xl font-bold text-neutral-800">About Us</h2>
          <p className="text-lg text-neutral-600 leading-relaxed">
            We are a team of engineers dedicated to solving the visibility
            problem in software development. We believe that you can't improve
            what you can't measure. Our mission is to provide crystal clear
            insights into codebase health, empowering teams to ship faster and
            with more confidence.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-neutral-500 text-sm border-t border-neutral-200">
        © 2026 Aiinhome Technologies Private Limited. All rights reserved.
      </footer>
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
    <div className="p-8 bg-gray-200/80 backdrop-blur-sm rounded-2xl border border-gray-300 hover:border-indigo-200 transition-all hover:shadow-lg hover:shadow-indigo-900/5 cursor-default">
      <div className="mb-6 p-4 bg-gray-300 rounded-xl w-fit">{icon}</div>
      <h3 className="text-xl font-bold text-neutral-800 mb-3">{title}</h3>
      <p className="text-neutral-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function PricingCard({
  plan,
  price,
  desc,
  features,
  isPopular,
}: {
  plan: string;
  price: string;
  desc: string;
  features: string[];
  isPopular?: boolean;
}) {
  return (
    <div
      className={`p-8 rounded-2xl border transition-all ${isPopular ? "bg-gray-100 shadow-xl shadow-indigo-900/10 border-indigo-200 scale-105" : "bg-gray-200/50 border-gray-300 hover:bg-gray-200"}`}
    >
      {isPopular && (
        <span className="bg-indigo-700 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block">
          MOST POPULAR
        </span>
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
        variant={isPopular ? "default" : "outline"}
        className={`w-full cursor-pointer ${isPopular ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "border-neutral-300 bg-indigo-900 hover:bg-indigo-800 text-white"}`}
      >
        Choose {plan}
      </Button>
    </div>
  );
}
