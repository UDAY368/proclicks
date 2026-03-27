import { SiteHeader } from "@/components/nav/SiteHeader";
import { HeroSection } from "@/components/hero/HeroSection";
import { ApproachTimelineSection } from "@/components/approach/ApproachTimelineSection";
import { AboutPremiumSection } from "@/components/about/AboutPremiumSection";
import { PortfolioCarouselDynamic } from "@/components/portfolio/PortfolioCarouselDynamic";
import { PortfolioVideoCarousel } from "@/components/portfolio/PortfolioVideoCarousel";
import { BrandStrip } from "@/components/brands/BrandStrip";
import { TeamSection } from "@/components/team/TeamSection";
import { ContactSection } from "@/components/contact/ContactSection";
import { SiteFooter } from "@/components/footer/SiteFooter";

function SectionShell({
  id,
  kicker,
  title,
  body,
}: {
  id: string;
  kicker: string;
  title: string;
  body: string;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-28 border-t border-black/[0.06] bg-[#fbfbfc] px-6 py-24 sm:scroll-mt-32 sm:px-10 md:px-12"
    >
      <div className="mx-auto max-w-[1400px]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#ff2c6b]">
          {kicker}
        </p>
        <h2 className="mt-4 max-w-2xl font-[family-name:var(--font-display)] text-3xl font-normal tracking-tight text-zinc-900 sm:text-4xl">
          {title}
        </h2>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-zinc-600 sm:text-base">
          {body}
        </p>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />

      <main className="flex-1 bg-[#050506]">
        <HeroSection />
        <AboutPremiumSection />
        <ApproachTimelineSection />
        <PortfolioCarouselDynamic
          kicker="Portfolio"
          title="Selected projects & collaborations"
          subtitle="Campaigns, editorials, and brand stories — hover to pause the reel."
        />
        <PortfolioVideoCarousel
          kicker="Showreel"
          title="Cinematic reels for bold brands"
          subtitle="Short-form hero cuts — lighting, movement, and story. Use the arrows to browse."
        />
        <BrandStrip />
        <TeamSection />
        <ContactSection />
      </main>

      <SiteFooter />
    </div>
  );
}
