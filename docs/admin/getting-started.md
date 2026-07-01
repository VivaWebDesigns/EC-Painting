# Getting Started In The Admin

This documentation area is the operating manual for the 593 EC Painting admin. It keeps practical editing and operations notes in one searchable library.

## Recommended First Pass

1. Review the CMS and visual builder guides before editing public pages.
2. Review the media library guide before replacing images or documents.
3. Review the forms guide before publishing, sharing, or embedding managed forms.
4. Review the integrations and backups guides before changing infrastructure or credentials.
5. Review the public site seeding guide before running any CMS seed or reset command.

## Admin Workflow Principles

- Make draft changes first whenever the workflow supports it.
- Use preview and device checks before publishing page changes.
- Prefer the media library and structured CMS fields over raw links or pasted embed code.
- If you open an editor and see it in read-only mode, another admin or editor already holds the live edit lock for that item.
- Use the documentation library as the source of truth for operational processes.

## Core Areas

### CMS Pages

The CMS manages public landing pages, structured sections, menus, sidebars, widget areas, and reusable media.

### Forms

Forms includes both the builder and the stored form-entry inbox. It also controls standalone form links and Mailchimp form tagging.

### Integrations

Settings under Admin control system integrations such as Cloudflare R2 and Mailgun. Changes there affect live services.

### Recovery

Backups, deployment notes, and operational runbooks are included in this documentation library and should be reviewed before major changes.

### Public Site Seeding

The public-site seed script is create-only by default and preserves CMS/admin edits. Its reset flags can overwrite live CMS pages, menus, SEO, robots.txt, and branding settings, so review the seeding guide before using them.
