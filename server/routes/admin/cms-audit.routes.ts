import { Router } from "express";
import { storage } from "../../storage/index";

const router = Router();

function pageIssues(page: any): string[] {
  const issues: string[] = [];
  if (!page.seoTitle) issues.push("missing_seo_title");
  if (!page.seoDescription) issues.push("missing_seo_description");
  if (!page.ogImageUrl) issues.push("missing_og_image");
  if (page.noindex) issues.push("noindex");
  if (page.status === "draft") issues.push("not_published");
  if (page.status === "published" && !page.canonicalUrl) issues.push("no_canonical");
  return issues;
}

router.get("/seo-audit", async (_req, res) => {
  try {
    const pages = await storage.cmsPages.getAllPages();

    res.json({
      pages: pages.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        status: p.status,
        noindex: p.noindex,
        seoTitle: p.seoTitle,
        seoDescription: p.seoDescription,
        ogImageUrl: p.ogImageUrl,
        canonicalUrl: p.canonicalUrl,
        updatedAt: p.updatedAt,
        issues: pageIssues(p),
      })),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to run SEO audit" });
  }
});

export default router;
