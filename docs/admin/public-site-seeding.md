# Public Site Seeding

The EC Painting public-site seed script creates the baseline CMS pages, menus, SEO settings, and branding settings used by the live public site.

Script:

```bash
tsx server/scripts/seed-ec-painting-public-site.ts
```

For production database work, run the command inside the Railway service:

```bash
railway ssh --service EC-Painting -- npx tsx server/scripts/seed-ec-painting-public-site.ts
```

## Default Safety

Normal seed runs are create-only for existing CMS pages, menus, SEO settings, and branding settings.

If a record already exists, the seed skips it instead of replacing CMS/admin edits. This protects edited page copy, block structure, hero images, gallery/card images, focal points, crop or position values, alt text, captions, page SEO fields, canonical URLs, noindex status, menu customizations, robots.txt, and branding settings.

Use a normal seed run when a new environment is missing public-site records or when newly added seed records need to be created without changing existing live content.

## Flags

`--update-existing`

Updates existing seeded pages from the code-defined page content. Existing menus, global SEO settings, and branding settings are still skipped unless their own reset flags are also provided. Page-level protected fields and protected image-related content fields remain preserved by default.

`--update-pages`

Alias for `--update-existing`. Use either flag when intentionally refreshing page text or structure from the seed while preserving protected CMS/admin fields.

`--reset-menus`

Replaces existing seeded menu locations with the seed-defined menu structures and deletes obsolete seed-managed footer menu locations. This can overwrite admin menu labels, URLs, nesting, ordering, and custom menu items.

Use only when the intended result is to restore the seeded navigation.

`--reset-seo`

Replaces existing global SEO settings with seed defaults. This can overwrite site name, title suffix, default meta description, site URL, default social image, organization fields, social links, default robots noindex, and custom robots.txt content.

Use only when intentionally restoring baseline SEO configuration.

`--reset-branding`

Replaces existing seeded branding settings with seed defaults. This can overwrite business identity, phone/address settings, logo/favicon URLs, fonts, brand colors, and text colors.

Use only when intentionally restoring baseline brand settings.

`--delete-obsolete`

Deletes obsolete legacy seeded public pages by slug. Use only when intentionally cleaning up seed-managed legacy pages. Do not use this flag to remove admin-created pages that happen to share an old slug unless that deletion is intended.

`--force`

Combines `--update-pages`, `--reset-menus`, `--reset-seo`, `--reset-branding`, and `--delete-obsolete`.

This is a reset operation. It can overwrite page-level SEO/status/canonical fields, menus, global SEO, robots.txt, branding, and obsolete pages. Protected content image/focal/alt/caption fields are still preserved unless specifically allowlisted.

## Advanced Page Field Allowlist

`--reset-page-field=<field-or-path>` allows a specific protected page field to be overwritten during page update mode.

Examples:

```bash
tsx server/scripts/seed-ec-painting-public-site.ts --update-pages --reset-page-field=seoTitle
tsx server/scripts/seed-ec-painting-public-site.ts --update-pages --reset-page-field=content.blocks.0.props.backgroundImageUrl
```

Use this only for deliberate, field-specific seed updates. Prefer the admin CMS for normal content, image, SEO, and branding changes.

