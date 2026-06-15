import { Link } from "wouter";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/page-layout";
import { useSeo } from "@/hooks/use-seo";

const ABOUT_IMAGE_URL = "/img/about-family.webp";

const stats = [
  { value: "5+", label: "Years Serving Charlotte" },
  { value: "100s", label: "Homes Painted" },
];

const trustPoints = [
  { icon: ShieldCheck, label: "Fully Insured" },
  { icon: Clock, label: "On-Time Communication" },
  { icon: CheckCircle, label: "Clean Work" },
];

const values = [
  "Honest, clear pricing before work begins",
  "Real prep work that helps the finish last",
  "Daily updates from a local owner-operated team",
  "A written 3-year workmanship warranty",
];

const serviceArea =
  "Charlotte, Matthews, Mint Hill, Monroe, Pineville, Huntersville, Cornelius, Davidson, Concord, Tega Cay, Waxhaw, Indian Trail, Stallings, Fort Mill, Indian Land, Rock Hill, and surrounding areas.";

export default function AboutPage() {
  useSeo({
    title: "About 593 EC Painting | Family-Owned Charlotte Painters",
    description:
      "Meet Esau and Sandra, the family behind 593 EC Painting. Family-owned house painters serving Charlotte, NC with honest quotes, careful prep, and clean communication.",
    canonical:
      typeof window !== "undefined" ? `${window.location.origin}/about` : undefined,
  });

  return (
    <PageLayout>
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1fr)] lg:items-center lg:gap-14 lg:py-24">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-primary">
              About Us
            </p>
            <h1 className="font-heading text-4xl font-extrabold leading-tight text-slate-950 sm:text-5xl">
              Hi there. We&apos;re the family behind 593 EC Painting.
            </h1>
            <div className="mt-7 space-y-5 text-lg leading-8 text-slate-600">
              <p>
                593 EC Painting is run by Esau and Sandra, a husband-and-wife team
                painting homes across Charlotte and the surrounding Carolinas with
                honest pricing, careful prep, and clear communication.
              </p>
              <p>
                We started this business because homeowners deserved better than
                vague estimates, disappearing crews, and paint jobs that look good
                for a season. When you call us, you reach the owners directly. When
                we paint your home, we treat it like our own.
              </p>
            </div>

            <div className="mt-8 grid max-w-md grid-cols-2 gap-6">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-extrabold text-primary sm:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-500">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-x-7 gap-y-4">
              {trustPoints.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 text-sm font-medium text-slate-600">
                  <Icon className="h-5 w-5 text-primary" />
                  <span>{label}</span>
                </div>
              ))}
            </div>

            <Button asChild size="lg" className="mt-9 min-h-12 px-7">
              <Link href="/contact">
                Get a Free Estimate
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-lg shadow-[0_22px_55px_rgba(15,23,42,0.16)]">
              <img
                src={ABOUT_IMAGE_URL}
                alt="Esau and Sandra with their family outdoors"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
          <h2 className="font-heading text-3xl font-extrabold text-slate-950 sm:text-4xl">
            Our Values
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            We believe in showing up when we say we will, protecting your home,
            communicating clearly, and doing the prep work right the first time.
            That is the foundation of every project we take on.
          </p>
          <div className="mt-8 grid gap-3 text-left sm:grid-cols-2">
            {values.map((value) => (
              <div key={value} className="flex gap-3 rounded-md bg-white p-4 shadow-sm">
                <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p className="text-sm font-medium leading-6 text-slate-700">{value}</p>
              </div>
            ))}
          </div>
          <Button asChild size="lg" className="mt-9 min-h-12 px-7">
            <Link href="/contact">
              Contact Us Today
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <h2 className="font-heading text-3xl font-extrabold text-slate-950 sm:text-4xl">
            Where We Work
          </h2>
          <p className="mt-6 max-w-5xl text-base leading-8 text-slate-600">
            We serve homeowners across the greater Charlotte metro and into the
            South Carolina border communities, generally within about 30 miles of
            Charlotte.
          </p>
          <p className="mt-5 max-w-5xl text-base leading-8 text-slate-600">
            <strong className="font-semibold text-slate-900">Cities we serve:</strong>{" "}
            {serviceArea}
          </p>
        </div>
      </section>

      <section className="bg-slate-950 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
          <h2 className="font-heading text-3xl font-extrabold sm:text-4xl">
            Let&apos;s Talk About Your Project
          </h2>
          <p className="mt-5 text-lg leading-8 text-white/75">
            Give us a call or request a free quote online. We&apos;ll come out,
            listen to what you have in mind, and write you a clear, honest estimate.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="min-h-12 px-7">
              <Link href="/contact">Request a Free Quote</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="min-h-12 border-white/20 bg-white/5 px-7 text-white hover:bg-white hover:text-slate-950"
            >
              <a href="tel:+17743297109">Call (774) 329-7109</a>
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
