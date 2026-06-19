import { randomUUID } from "crypto";
import { storage } from "../storage";

const obsoleteLegacyPlatformPageSlugs = ["directory", "events", "insights", "recordings", "join"];

function id() {
  return randomUUID();
}

function buildPrivacyPolicyContent() {
  return {
    blocks: [
      {
        id: id(),
        type: "section-header",
        props: {
          eyebrow: "Legal",
          title: "Privacy Policy",
          subtitle:
            "Review how 593 EC Painting collects, uses, stores, and protects information shared through the website and related services.",
          alignment: "left",
          headingLevel: "h1",
        },
      },
      {
        id: id(),
        type: "rich-text",
        props: {
          alignment: "left",
          content:
            "<p><strong>Last updated:</strong> April 12, 2026</p><p>593 EC Painting respects your privacy and is committed to protecting information you share with us. This Privacy Policy explains how we may collect, use, disclose, and safeguard information when you visit our website, request an estimate, submit a form, or otherwise communicate with us.</p><h2>1. Information We Collect</h2><p>We may collect information you voluntarily provide, such as your name, email address, phone number, project address, project details, photos, scheduling preferences, and messages submitted through website forms or other contact methods. We may also collect basic usage data automatically, including browser type, device information, IP address, referral source, pages viewed, and interactions with the website.</p><h2>2. How We Use Information</h2><p>We may use information to respond to inquiries, prepare estimates, schedule appointments, provide painting-related services, manage customer relationships, improve the website, protect our systems, and comply with legal obligations.</p><h2>3. Cookies and Analytics</h2><p>We may use cookies, analytics tools, pixels, and similar technologies to understand website performance, remember preferences, and improve user experience. You may be able to control some cookie preferences through your browser settings.</p><h2>4. How We Share Information</h2><p>We may share information with service providers that help us operate the website or business, such as hosting, email delivery, analytics, scheduling, file storage, and customer support providers. We may also disclose information when required by law, to protect rights or safety, in connection with a business transfer, or with your consent.</p><h2>5. Project Information</h2><p>Information about your painting project, including property details and photos, is used to evaluate your request and provide services. Avoid submitting confidential or unnecessary personal information through public website forms.</p><h2>6. Data Retention</h2><p>We retain information for as long as reasonably necessary to provide services, maintain records, resolve disputes, comply with legal obligations, and operate our business.</p><h2>7. Security</h2><p>We use reasonable safeguards designed to protect personal information. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.</p><h2>8. Your Rights and Choices</h2><p>Depending on your location, you may have rights relating to access, correction, deletion, objection, restriction, portability, or withdrawal of consent. You may also opt out of marketing communications where applicable.</p><h2>9. Third-Party Links and Services</h2><p>Our website may contain links to third-party websites, maps, payment tools, social media services, or other external services. We are not responsible for the privacy practices of third parties, and you should review their policies separately.</p><h2>10. Changes to This Policy</h2><p>We may update this Privacy Policy from time to time. Updated versions will be posted on this page with a revised effective or last-updated date.</p><h2>11. Contact Us</h2><p>If you have questions about this Privacy Policy or your personal information, please contact us through the contact information listed on the website.</p>",
        },
      },
    ],
  };
}

function buildTermsOfServiceContent() {
  return {
    blocks: [
      {
        id: id(),
        type: "section-header",
        props: {
          eyebrow: "Legal",
          title: "Terms of Service",
          subtitle:
            "Review the terms governing use of the 593 EC Painting website and related services.",
          alignment: "left",
          headingLevel: "h1",
        },
      },
      {
        id: id(),
        type: "rich-text",
        props: {
          alignment: "left",
          content:
            "<p><strong>Last updated:</strong> April 12, 2026</p><p>These Terms of Service govern your access to and use of the 593 EC Painting website, content, forms, and related online services. By accessing or using the website, you agree to be bound by these Terms. If you do not agree, do not use the website.</p><h2>1. Acceptable Use</h2><p>You agree to use the website only for lawful purposes and in accordance with these Terms. You may not misuse the website, attempt unauthorized access, interfere with security, upload malicious content, scrape or copy data in prohibited ways, impersonate others, or use the site in a manner that could damage the website or other users.</p><h2>2. Informational Nature of Website Content</h2><p>Website content is provided for general informational purposes related to painting services, project planning, estimates, materials, maintenance, and related topics. Content does not replace professional evaluation of your specific property or project.</p><h2>3. Estimates and Project Requests</h2><p>Submitting a form or requesting an estimate does not create a binding service agreement. Pricing, scheduling, availability, scope of work, materials, warranty terms, and other project details may be confirmed separately in a written estimate, proposal, invoice, or agreement.</p><h2>4. Accounts and Submissions</h2><p>If you submit information through forms or other website features, you agree to provide accurate and current information. You are responsible for ensuring that photos, project details, testimonials, or other materials you submit are lawful and that you have permission to share them.</p><h2>5. Payments and Services</h2><p>Any payment terms, deposits, billing schedules, refund terms, and service conditions are governed by the applicable estimate, proposal, invoice, or written agreement provided for your project.</p><h2>6. Intellectual Property</h2><p>Unless otherwise indicated, the website, branding, design, text, graphics, software, original content, and related materials are owned by or licensed to 593 EC Painting and are protected by applicable intellectual property laws. You may not reproduce, distribute, modify, or exploit site content beyond permitted personal or internal use without prior written permission.</p><h2>7. User Content</h2><p>If you submit content, including reviews, photos, messages, or other materials, you grant us permission to host, reproduce, display, adapt, and use that content as reasonably necessary to operate, promote, and improve the website and services. You represent that you have the rights needed to submit such content.</p><h2>8. Third-Party Services and Links</h2><p>The website may include links to third-party websites, maps, payment processors, analytics providers, email tools, social media services, or other external services. We do not control third-party services and are not responsible for their content, availability, or practices.</p><h2>9. Disclaimers</h2><p>The website is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis to the fullest extent permitted by law. We disclaim warranties of any kind, whether express or implied, including warranties of merchantability, fitness for a particular purpose, non-infringement, and uninterrupted availability.</p><h2>10. Limitation of Liability</h2><p>To the fullest extent permitted by law, 593 EC Painting and its affiliates, personnel, contractors, and partners will not be liable for indirect, incidental, consequential, special, exemplary, or punitive damages, or for loss of profits, data, goodwill, business interruption, or outcomes resulting from use of or inability to use the website.</p><h2>11. Indemnification</h2><p>You agree to defend, indemnify, and hold harmless 593 EC Painting and its affiliates, personnel, and partners from claims, liabilities, damages, judgments, losses, costs, and expenses arising from your use of the website, your submissions, your violation of these Terms, or your violation of applicable law or third-party rights.</p><h2>12. Changes to These Terms</h2><p>We may update these Terms from time to time. Revised versions will be posted on this page with an updated date. Your continued use of the website after changes become effective constitutes acceptance of the revised Terms, where permitted by law.</p><h2>13. Contact</h2><p>If you have questions about these Terms, please contact us using the contact information provided on the website.</p>",
        },
      },
    ],
  };
}

function buildDisclaimerContent() {
  return {
    blocks: [
      {
        id: id(),
        type: "section-header",
        props: {
          eyebrow: "Legal",
          title: "Disclaimer",
          subtitle:
            "Review important information about website content, estimates, project photos, colors, materials, and service information.",
          alignment: "left",
          headingLevel: "h1",
        },
      },
      {
        id: id(),
        type: "rich-text",
        props: {
          alignment: "left",
          content:
            "<p>Information on this website is provided for general informational purposes related to painting services and project planning. It should not be treated as a final estimate, professional inspection, or binding service agreement for any specific property.</p><p>Project scope, pricing, scheduling, materials, preparation requirements, warranty terms, and service availability may vary based on property conditions and will be confirmed separately in a written estimate, proposal, invoice, or agreement.</p><p>Photos, galleries, reviews, examples, color names, and finish descriptions are illustrative. Actual results may vary based on lighting, surface condition, paint product, substrate, preparation, age of existing coatings, and other site-specific factors. Always review final project details directly with 593 EC Painting before authorizing work.</p>",
        },
      },
    ],
  };
}

export async function ensureSystemCmsPages() {
  for (const slug of obsoleteLegacyPlatformPageSlugs) {
    const existingPage = await storage.cmsPages.getPageBySlug(slug);
    if (existingPage) {
      await storage.cmsPages.deletePage(existingPage.id);
    }
  }

  const existingPrivacyPolicy = await storage.cmsPages.getPageBySlug("privacy-policy");
  if (!existingPrivacyPolicy) {
    await storage.cmsPages.createPage({
      title: "Privacy Policy",
      slug: "privacy-policy",
      pageType: "custom",
      template: "full-width",
      status: "published",
      content: buildPrivacyPolicyContent(),
      seoTitle: "Privacy Policy | 593 EC Painting",
      seoDescription: "Review how 593 EC Painting collects, uses, and protects information submitted through the website.",
      seoKeywords: "privacy policy, data privacy, 593 EC Painting privacy",
      ogImageUrl: "",
      canonicalUrl: "",
      noindex: false,
      publishedAt: new Date(),
      scheduledAt: null,
      createdBy: null,
      updatedBy: null,
      sidebarId: null,
    });
  }

  const existingTermsOfService = await storage.cmsPages.getPageBySlug("terms-of-service");
  if (!existingTermsOfService) {
    await storage.cmsPages.createPage({
      title: "Terms of Service",
      slug: "terms-of-service",
      pageType: "custom",
      template: "full-width",
      status: "published",
      content: buildTermsOfServiceContent(),
      seoTitle: "Terms of Service | 593 EC Painting",
      seoDescription: "Review the 593 EC Painting terms of service for use of the website and related services.",
      seoKeywords: "terms of service, terms and conditions, 593 EC Painting terms",
      ogImageUrl: "",
      canonicalUrl: "",
      noindex: false,
      publishedAt: new Date(),
      scheduledAt: null,
      createdBy: null,
      updatedBy: null,
      sidebarId: null,
    });
  }

  const existingDisclaimer = await storage.cmsPages.getPageBySlug("disclaimer");
  if (!existingDisclaimer) {
    await storage.cmsPages.createPage({
      title: "Disclaimer",
      slug: "disclaimer",
      pageType: "custom",
      template: "full-width",
      status: "published",
      content: buildDisclaimerContent(),
      seoTitle: "Disclaimer | 593 EC Painting",
      seoDescription: "Review important information about website content, estimates, project examples, colors, materials, and service information.",
      seoKeywords: "disclaimer, painting disclaimer, estimate disclaimer, 593 EC Painting disclaimer",
      ogImageUrl: "",
      canonicalUrl: "",
      noindex: false,
      publishedAt: new Date(),
      scheduledAt: null,
      createdBy: null,
      updatedBy: null,
      sidebarId: null,
    });
  }
}
