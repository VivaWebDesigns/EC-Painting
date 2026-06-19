export type { PublicSearchResult, PublicSearchResultType } from "./public-search";

export const UserRole = {
  ADMIN: "admin",
  EDITOR: "editor",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const AdminPermission = {
  CONTENT: "content",
  DESIGN: "design",
  CRM: "crm",
} as const;
export type AdminPermission = (typeof AdminPermission)[keyof typeof AdminPermission];
