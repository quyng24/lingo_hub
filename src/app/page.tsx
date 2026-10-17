import HomeNavbar from "@/components/home/HomeNavbar";
import HeroSection from "@/components/home/HeroSection";
import StatsDataSection from "@/components/home/StatsDataSection";
import LearningFlowSection from "@/components/home/LearningFlowSection";
import SpacedRepetitionExplainer from "@/components/home/SpacedRepetitionExplainer";
import CtaFooterSection from "@/components/home/CtaFooterSection";
import FeatureModesSection from "@/components/home/FeatureModesSection";

export default function LingoHubLanding() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-300 font-sans selection:bg-emerald-500/30">
      <HomeNavbar />

      <HeroSection />

      <StatsDataSection />

      <div id="learning-flow">
        <LearningFlowSection />
      </div>

      <div id="srs">
        <SpacedRepetitionExplainer />
      </div>

      <FeatureModesSection />

      <CtaFooterSection />
    </main>
  );
}
