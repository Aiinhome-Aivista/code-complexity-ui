"use client";

import Footer from "@/components/layouts/Footer";
import { ArrowForward, CalendarToday, Person } from "@mui/icons-material";
import Link from "next/link";

const BLOG_POSTS = [
  {
    id: 1,
    title: "Understanding Cyclomatic Complexity in React",
    excerpt: "Why simpler components are easier to test and maintain, and how to refactor complex ones.",
    date: "Feb 12, 2026",
    author: "Alex Chen",
    category: "Engineering",
    color: "bg-blue-600"
  },
  {
    id: 2,
    title: "The Security Risks of Dead Code",
    excerpt: "Unused code isn't just clutter—it's a potential attack vector. Here's how to identify and remove it safely.",
    date: "Feb 08, 2026",
    author: "Sarah Miller",
    category: "Security",
    color: "bg-emerald-600"
  },
  {
    id: 3,
    title: "Optimizing Bundle Size with Heatmaps",
    excerpt: "Visualizing your bundle size can reveal surprising dependencies. Learn how we cut our load time by 40%.",
    date: "Feb 01, 2026",
    author: "James Wilson",
    category: "Performance",
     color: "bg-amber-600"
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-100 text-neutral-800 font-sans">
      <section className="pt-32 pb-16 px-4 bg-neutral-900 text-white">
        <div className="container mx-auto max-w-5xl text-center">
             <h1 className="text-4xl md:text-5xl font-bold mb-6">Engineering Blog</h1>
             <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
                Thoughts, tutorials, and insights on software engineering quality and best practices.
             </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
            <div className="grid md:grid-cols-3 gap-8">
                {BLOG_POSTS.map((post) => (
                    <article key={post.id} className="flex flex-col bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
                        <div className={`h-48 w-full ${post.color} relative overflow-hidden group`}>
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-neutral-800">
                                {post.category}
                            </div>
                        </div>
                        <div className="p-6 flex flex-col flex-1">
                            <div className="flex items-center gap-4 text-xs text-neutral-500 mb-4">
                                <span className="flex items-center gap-1"><CalendarToday fontSize="inherit" /> {post.date}</span>
                                <span className="flex items-center gap-1"><Person fontSize="inherit" /> {post.author}</span>
                            </div>
                            <h2 className="text-xl font-bold text-neutral-900 mb-3 leading-snug hover:text-indigo-700 cursor-pointer">
                                {post.title}
                            </h2>
                            <p className="text-neutral-600 text-sm leading-relaxed mb-6 flex-1">
                                {post.excerpt}
                            </p>
                            <Link href="#" className="flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:gap-3 transition-all">
                                Read Article <ArrowForward fontSize="small" />
                            </Link>
                        </div>
                    </article>
                ))}
            </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
