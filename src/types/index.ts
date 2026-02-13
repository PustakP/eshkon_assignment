// role enum - hierarchical: super_admin > admin > editor > viewer
export type Role = "viewer" | "editor" | "admin" | "super_admin";

// user profile from supabase
export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: Role;
  created_at: string;
  updated_at: string;
};

// page status
export type PageStatus = "draft" | "published";

// block types for the page builder
export type BlockType = "heading" | "paragraph" | "image" | "divider" | "spacer";

// block data variants
export type HeadingData = { level: 1 | 2 | 3; text: string };
export type ParagraphData = { html: string };
export type ImageData = { url: string; alt: string };
export type DividerData = Record<string, never>;
export type SpacerData = { height: number };

// union block data
export type BlockData =
  | HeadingData
  | ParagraphData
  | ImageData
  | DividerData
  | SpacerData;

// single content block
export type Block = {
  id: string;
  type: BlockType;
  data: BlockData;
};

// page record
export type Page = {
  id: string;
  title: string;
  slug: string;
  status: PageStatus;
  content: Block[];
  author_id: string;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

// page version (audit trail)
export type PageVersion = {
  id: string;
  page_id: string;
  content: Block[];
  version: number;
  created_by: string;
  created_at: string;
};
