"use client";

import Footer from "@/components/layouts/Footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-100 text-neutral-800 font-sans">
      <div className="pt-32 pb-12 px-4 bg-white border-b border-neutral-200">
        <div className="max-w-3xl mx-auto">
             <span className="text-indigo-600 font-bold tracking-wider text-sm uppercase mb-2 block animate-fade-in">Legal Documentation</span>
             <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4 animate-fade-in">Privacy Policy</h1>
             <p className="text-neutral-500 animate-fade-in">Effective Date: February 6, 2026</p>
        </div>
      </div>

      <div className="py-20 px-4">
        <div className="max-w-3xl mx-auto bg-white p-8 md:p-16 rounded-3xl shadow-sm border border-neutral-200 prose prose-lg prose-indigo prose-neutral max-w-none">
          <p className="lead">
            At CodeView, we prioritize the privacy and security of your code and personal data. This policy outlines our practices in clear, transparent terms.
          </p>
          
          <h3>1. Information We Collect</h3>
          <p>
            We collect information you provide directly to us, such as when you create an account, update your profile, or use our interactive features. This includes:
            <ul>
                <li><strong>Account Information:</strong> Name, email address, and password.</li>
                <li><strong>Source Code:</strong> Code entered into our analysis tools is processed ephemerally.</li>
                <li><strong>Usage Data:</strong> Information about how you interact with our services.</li>
            </ul>
          </p>

          <h3>2. How We Use Your Data</h3>
          <p>
            We use the data we collect to operate, maintain, and improve our services. Specifically, we use it to:
            <ul>
                <li>Provide and improve our complexity analysis algorithms.</li>
                <li>Send you technical notices, updates, and support messages.</li>
                <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities.</li>
            </ul>
          </p>

          <h3>3. Data Security</h3>
          <p>
            We employ industry-standard security measures to protect your data. Your source code is analyzed in isolated environments and is <strong>never stored permanently</strong> unless you explicitly opt-in to historical analysis features. All data transmission is encrypted via SSL/TLS.
          </p>
          
           <h3>4. Your Rights</h3>
          <p>
            You have the right to access, correct, or delete your personal information at any time. You can manage your communication preferences in your account settings.
          </p>

           <h3>5. Contact Us</h3>
          <p>
            If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@codeview.io">privacy@codeview.io</a>.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
