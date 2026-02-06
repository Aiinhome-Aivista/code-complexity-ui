import Link from "next/link";
import { BarChart } from "@mui/icons-material";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 flex justify-center py-10">
      <div className="container">
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-24">
          {/* Brand Column */}
          <div className="space-y-6 max-w-sm">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-700 text-white text-xl font-bold p-1.5 rounded-xl shadow-lg shadow-indigo-900/10">
                CV
              </div>
              <span className="text-xl font-bold text-neutral-900">
                CodeView
              </span>
            </div>
            <p className="text-neutral-500 text-sm leading-relaxed">
              Empowering teams to make data-driven decisions without the
              technical overhead.
            </p>
            <p className="text-neutral-400 text-sm">
              © 2026 CodeView Inc.
            </p>
          </div>

          {/* Links Columns */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-8 lg:max-w-2xl">
            {/* Product */}
            <div className="space-y-4">
              <h4 className="font-bold text-neutral-900 text-sm uppercase tracking-wider">
                Product
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="#features"
                    className="text-neutral-500 hover:text-indigo-600 text-sm transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#pricing"
                    className="text-neutral-500 hover:text-indigo-600 text-sm transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h4 className="font-bold text-neutral-900 text-sm uppercase tracking-wider">
                Company
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/about"
                    className="text-neutral-500 hover:text-indigo-600 text-sm transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-neutral-500 hover:text-indigo-600 text-sm transition-colors"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h4 className="font-bold text-neutral-900 text-sm uppercase tracking-wider">
                Support
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/help-center"
                    className="text-neutral-500 hover:text-indigo-600 text-sm transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-neutral-500 hover:text-indigo-600 text-sm transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
