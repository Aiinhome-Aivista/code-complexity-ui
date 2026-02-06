"use client";

import Footer from "@/components/layouts/Footer";
import { Groups, Lightbulb, Security, Bolt } from "@mui/icons-material";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-100 text-neutral-800 font-sans">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-neutral-900">
            We're building the future of <br />
            <span className="text-indigo-700">Code Intelligence</span>
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            CodeView empowers engineering teams to write better, safer, and more maintainable code through advanced visualization and analytics.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 bg-white/50 border-y border-neutral-200">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-800 mb-4">Our Core Values</h2>
            <p className="text-neutral-500 max-w-xl mx-auto">
              The principles that guide every decision we make.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <ValueCard 
              icon={<Lightbulb className="text-amber-500" fontSize="large" />}
              title="Clarity First"
              desc="We believe complex systems should be easy to understand. We strive to make the invisible visible."
            />
            <ValueCard 
              icon={<Security className="text-emerald-600" fontSize="large" />}
              title="Uncompromising Security"
              desc="Your code is your most valuable asset. We treat it with the highest level of security and privacy."
            />
             <ValueCard 
              icon={<Groups className="text-indigo-600" fontSize="large" />}
              title="Developer Centric"
              desc="Built by developers, for developers. We solve real problems that technical teams face daily."
            />
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-5xl">
             <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-neutral-800 mb-4">Meet the Team</h2>
                <p className="text-neutral-500">The minds behind the platform.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
                <TeamCard name="Alex Chen" role="Founder & CEO" color="bg-indigo-100 text-indigo-700" />
                <TeamCard name="Sarah Miller" role="CTO" color="bg-emerald-100 text-emerald-700" />
                <TeamCard name="James Wilson" role="Head of Product" color="bg-amber-100 text-amber-700" />
            </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function ValueCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-8 bg-white rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md transition-all pt-10">
      <div className="mb-4 bg-neutral-50 w-14 h-14 rounded-xl flex items-center justify-center border border-neutral-100">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-neutral-900 mb-3">{title}</h3>
      <p className="text-neutral-600 leading-relaxed">{desc}</p>
    </div>
  );
}

function TeamCard({ name, role, color }: { name: string, role: string, color: string }) {
    return (
        <div className="group text-center">
            <div className={`w-32 h-32 mx-auto rounded-full mb-6 flex items-center justify-center text-3xl font-bold ${color} transition-transform group-hover:scale-105`}>
                {name.charAt(0)}
            </div>
            <h3 className="text-xl font-bold text-neutral-900">{name}</h3>
            <p className="text-indigo-600 font-medium">{role}</p>
        </div>
    )
}
