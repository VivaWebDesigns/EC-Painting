import { cmsFormFieldSchema, type CmsFormField, type CmsFormSettings, type InsertCmsForm } from "@shared/schema";
import { z } from "zod";
import { storage } from "../storage";
import { logger } from "../utils/logger";

type CmsFormFieldInput = z.input<typeof cmsFormFieldSchema>;

function field(
  id: string,
  key: string,
  label: string,
  type: CmsFormField["type"],
  options: Partial<CmsFormFieldInput> = {}
): CmsFormField {
  return cmsFormFieldSchema.parse({
    id,
    key,
    label,
    type,
    placeholder: "",
    helpText: "",
    required: false,
    width: "full",
    options: [],
    config: {},
    ...options,
  });
}

function settings(overrides: Partial<CmsFormSettings>): CmsFormSettings {
  return {
    submitButtonText: "Submit",
    successMessage: "Thanks! Your submission has been received.",
    mailchimpEnabled: false,
    mailchimpTag: "",
    notifyAdmins: false,
    storeAsContactMessage: false,
    ...overrides,
  };
}

type ManagedSystemForm = InsertCmsForm;

const LEGACY_CONTACT_FORM_DESCRIPTION =
  "Primary public contact form used on the Contact page and embeddable form blocks.";

const CONTACT_FORM_DESCRIPTION =
  "Tell us a little about your project and we'll follow up to schedule your free quote.";

const SYSTEM_FORMS: ManagedSystemForm[] = [
  {
    name: "Contact Form",
    slug: "contact-form",
    description: CONTACT_FORM_DESCRIPTION,
    kind: "contact",
    isSystem: true,
    isActive: true,
    fields: [
      field("name", "name", "Name", "text", { placeholder: "Your name", required: true, width: "half" }),
      field("email", "email", "Email", "email", { placeholder: "you@example.com", required: true, width: "half" }),
      field("subject", "subject", "Subject", "text", { placeholder: "What is this about?", required: true }),
      field("message", "message", "Message", "textarea", { placeholder: "Tell us more...", required: true }),
    ],
    settings: settings({
      submitButtonText: "Send Message",
      successMessage: "Thank you for reaching out. We'll get back to you soon.",
      mailchimpEnabled: true,
      mailchimpTag: "593 EC Painting Contact Inquiry",
      notifyAdmins: true,
      storeAsContactMessage: true,
    }),
  },
];

export async function ensureSystemForms() {
  logger.app.info("Ensuring system forms");

  for (const systemForm of SYSTEM_FORMS) {
    const existing = await storage.forms.getBySlug(systemForm.slug);
    if (existing) {
      const existingDescription =
        existing.slug === "contact-form" && existing.description === LEGACY_CONTACT_FORM_DESCRIPTION
          ? CONTACT_FORM_DESCRIPTION
          : existing.description;

      await storage.forms.update(existing.id, {
        name: existing.name || systemForm.name,
        description: existingDescription ?? systemForm.description ?? "",
        kind: existing.kind || systemForm.kind,
        isSystem: true,
        isActive: existing.isActive ?? true,
        fields:
          Array.isArray(existing.fields) && existing.fields.length > 0
            ? existing.fields
            : systemForm.fields,
        settings:
          {
            ...systemForm.settings,
            ...(typeof existing.settings === "object" && existing.settings ? existing.settings : {}),
          },
      });
      continue;
    }

    await storage.forms.create(systemForm);
  }

  logger.app.info("System forms ensured");
}
