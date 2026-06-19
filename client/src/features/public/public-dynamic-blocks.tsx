import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PublicFormRenderer } from "@/components/forms/public-form-renderer";
import { CompanyInformationCard } from "@/components/shared/company-information-card";
import { Send } from "lucide-react";

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

export function ContactFormBlock() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8" data-testid="dynamic-contact-form">
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
    </div>
  );
}

export function ManagedFormEmbedBlock({ props }: { props: Record<string, unknown> }) {
  const formSlug = str(props.formSlug) || "contact-form";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" data-testid={`dynamic-form-embed-${formSlug}`}>
      <PublicFormRenderer slug={formSlug} />
    </div>
  );
}
