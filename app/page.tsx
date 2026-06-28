import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import BentoGrid from "@/components/landing/BentoGrid";
import Features from "@/components/landing/Features";
import Workflow from "@/components/landing/Workflow";
import Pricing from "@/components/landing/Pricing";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col w-full selection:bg-emerald-500/30 selection:text-emerald-200">
      <Navbar />
      <main className="flex-1 flex flex-col w-full">
        <Hero />
        <Features />
        <div id="integrations">
          <BentoGrid />
        </div>
        <Workflow />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
