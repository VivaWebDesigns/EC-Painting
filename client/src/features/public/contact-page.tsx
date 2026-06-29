import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send } from "lucide-react";
import { PageLayout } from "@/components/layout/page-layout";
import { PublicFormRenderer } from "@/components/forms/public-form-renderer";
import { CompanyInformationCard } from "@/components/shared/company-information-card";

export default function ContactPage() {
  return (
    <PageLayout>
      <section
        className="relative isolate flex min-h-[430px] items-center overflow-hidden bg-[#111827] text-white"
        data-testid="section-contact-hero"
        style={{
          backgroundImage: "url(/img/hero/ec-hero-contact.webp)",
          backgroundSize: "cover",
          backgroundPosition: "50% 50%",
        }}
      >
        <div className="absolute inset-0 bg-black/45" />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/45 to-transparent"
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-24 md:py-28">
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-4" data-testid="text-contact-heading">
            Get a Free Painting Quote
          </h1>
          <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
            Tell us about your project and we&apos;ll follow up to schedule a free on-site estimate.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14" data-testid="section-contact-form">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Send a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PublicFormRenderer slug="contact-form" showHeader={false} />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <CompanyInformationCard
              titleClassName="public-heading-3"
              bodyClassName="public-helper-text"
              linkClassName="public-text-link hover:text-[hsl(var(--public-text-link-hover))]"
            />
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
