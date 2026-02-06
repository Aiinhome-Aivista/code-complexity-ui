"use client";

import Footer from "@/components/layouts/Footer";
import { Search, Article, Settings, CreditCard, BugReport, ArrowForward, ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";

const HELP_CATEGORIES = [
  { icon: <Article fontSize="large" className="text-indigo-600" />, title: "Getting Started", desc: "Setting up your account and first project." },
  { icon: <BugReport fontSize="large" className="text-emerald-600" />, title: "Troubleshooting", desc: "Common issues and how to resolve them." },
  { icon: <Settings fontSize="large" className="text-amber-600" />, title: "Account Settings", desc: "Managing your team, profile, and security." },
  { icon: <CreditCard fontSize="large" className="text-purple-600" />, title: "Billing & Plans", desc: "Invoices, subscriptions, and payment methods." },
];

const FAQS = [
    { q: "How does CodeView calculate complexity?", a: "We use a combination of cyclomatic complexity, cognitive complexity, and dependency analysis to generate our scores." },
    { q: "Is my code stored effectively?", a: "No. We analyze your code in a secure, ephemeral environment. Once the analysis is complete, the code is wiped from our servers." },
    { q: "Can I integrate with GitHub Actions?", a: "Yes! We offer a CLI tool and GitHub Action for seamless integration into your CI/CD pipeline." },
    { q: "What languages are supported?", a: "Currently, we support JavaScript, TypeScript, Python, and Java. Support for Go and Rust is coming soon." }
]

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen bg-gray-100 text-neutral-800 font-sans">
      
      {/* Search Hero */}
      <section className="pt-32 pb-20 px-4 bg-indigo-900 text-white text-center">
         <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl font-bold">How can we help you?</h1>
            <div className="relative max-w-xl mx-auto">
                <input 
                    type="text" 
                    placeholder="Search for articles, guides, and FAQs..." 
                    className="w-full h-14 pl-14 pr-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/60 focus:outline-none focus:bg-white/20 focus:border-white/40 transition-all shadow-xl"
                />
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/60" fontSize="medium" />
            </div>
         </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 px-4 -mt-10">
        <div className="container mx-auto max-w-5xl">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {HELP_CATEGORIES.map((cat, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group">
                        <div className="mb-4 bg-gray-50 p-3 rounded-xl w-fit group-hover:bg-indigo-50 transition-colors">
                            {cat.icon}
                        </div>
                        <h3 className="font-bold text-neutral-900 mb-2">{cat.title}</h3>
                        <p className="text-sm text-neutral-500">{cat.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white/50 border-t border-neutral-200">
        <div className="container mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold text-center text-neutral-900 mb-12">Frequently Asked Questions</h2>
            <div className="space-y-4">
                {FAQS.map((faq, idx) => (
                    <Accordion key={idx} className="!rounded-xl !border-0 !shadow-none !bg-white before:!hidden">
                         <AccordionSummary expandIcon={<ExpandMore />} className="font-semibold text-neutral-800">
                            {faq.q}
                         </AccordionSummary>
                         <AccordionDetails className="text-neutral-600 leading-relaxed">
                            {faq.a}
                         </AccordionDetails>
                    </Accordion>
                ))}
            </div>
             <div className="text-center mt-12">
                <p className="text-neutral-500 mb-4">Still can't find what you're looking for?</p>
                <button className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20">
                    Contact Support
                </button>
            </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
