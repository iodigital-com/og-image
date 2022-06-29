export type FileType = "png" | "jpeg";
export type Theme = "light" | "dark";

export interface ParsedRequest {
  fileType: FileType;
  domain?: string;
  title: string;
  teaserImage?: string;
  author?: string;
  authorImage?: string;
  date?: string;
}
