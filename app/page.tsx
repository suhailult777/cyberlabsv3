import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ArrowRight, Terminal, Shield, Clock, Zap, ChevronRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-full bg-[#06060a] grid-bg scanlines">
      <Navbar />

      <main className="flex-1 pt-16">
        {/* Hero */}
        <section className="relative overflow-hidden py-24 sm:py-32">
          {/* Background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00e676]/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[#00e676]/10 border border-[#00e676]/20 text-[#00e676] text-xs font-bold font-[family-name:var(--font-mono)] mb-8 animate-fade-in">
              <Zap className="w-3.5 h-3.5" />
              MOCK PROTOTYPE FOR LEARNING
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-8 font-[family-name:var(--font-mono)] animate-fade-in">
              <span className="text-[#e8e8ec]">Hands-On Labs for</span>
              <br />
              <span className="text-[#00e676] text-glow">Future Cybersecurity Pros</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#8a8a9a] max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in">
              Rent ready-to-use lab environments. Practice penetration testing, network security,
              cloud security, and DevSecOps — all in your browser.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
              <Link
                href="/auth"
                className="group inline-flex items-center gap-2 px-8 py-4 text-sm font-bold text-[#06060a] bg-[#00e676] hover:bg-[#00c853] rounded-md transition-all glow-accent font-[family-name:var(--font-mono)]"
              >
                INITIALIZE_SESSION
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="flex items-center gap-2 text-xs text-[#5a5a6a] font-[family-name:var(--font-mono)]">
                <Terminal className="w-3.5 h-3.5" />
                <span>Demo: suhail@gmail.com / astr0000</span>
              </div>
            </div>
          </div>
        </section>

        {/* Terminal-style divider */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-[#1a1a2e]" />
            <span className="text-[10px] text-[#5a5a6a] font-[family-name:var(--font-mono)] tracking-[0.2em]">
              SYSTEM_FEATURES
            </span>
            <div className="flex-1 h-px bg-[#1a1a2e]" />
          </div>
        </div>

        {/* Features */}
        <section className="py-20 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 stagger-children">
              <div className="group p-6 rounded-lg border border-[#1a1a2e] bg-[#0e0e14] hover:border-[#00e676]/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,230,118,0.06)]">
                <div className="w-10 h-10 rounded-sm bg-[#00e676]/10 border border-[#00e676]/20 flex items-center justify-center mb-5">
                  <Terminal className="w-5 h-5 text-[#00e676]" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-[#e8e8ec] font-[family-name:var(--font-mono)]">
                  Real Environments
                </h3>
                <p className="text-sm text-[#8a8a9a] leading-relaxed">
                  Pre-configured labs with industry-standard tools like Kali Linux, Metasploit, and Wireshark.
                </p>
              </div>

              <div className="group p-6 rounded-lg border border-[#1a1a2e] bg-[#0e0e14] hover:border-[#00e676]/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,230,118,0.06)]">
                <div className="w-10 h-10 rounded-sm bg-[#00e676]/10 border border-[#00e676]/20 flex items-center justify-center mb-5">
                  <Clock className="w-5 h-5 text-[#00e676]" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-[#e8e8ec] font-[family-name:var(--font-mono)]">
                  Flexible Hours
                </h3>
                <p className="text-sm text-[#8a8a9a] leading-relaxed">
                  Rent labs by the hour. Extend anytime. Only pay for what you use.
                </p>
              </div>

              <div className="group p-6 rounded-lg border border-[#1a1a2e] bg-[#0e0e14] hover:border-[#00e676]/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,230,118,0.06)]">
                <div className="w-10 h-10 rounded-sm bg-[#00e676]/10 border border-[#00e676]/20 flex items-center justify-center mb-5">
                  <Shield className="w-5 h-5 text-[#00e676]" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-[#e8e8ec] font-[family-name:var(--font-mono)]">
                  Safe Sandbox
                </h3>
                <p className="text-sm text-[#8a8a9a] leading-relaxed">
                  Practice offensive and defensive techniques in isolated, safe environments.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 sm:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[#00e676]/[0.02]" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#e8e8ec] mb-4 font-[family-name:var(--font-mono)]">
              Ready to Deploy?
            </h2>
            <p className="text-[#8a8a9a] mb-8 max-w-lg mx-auto">
              Get started with your first lab environment in under a minute.
            </p>
            <Link
              href="/auth"
              className="group inline-flex items-center gap-2 px-8 py-4 text-sm font-bold text-[#06060a] bg-[#00e676] hover:bg-[#00c853] rounded-md transition-all glow-accent font-[family-name:var(--font-mono)]"
            >
              START_DEPLOYMENT
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
