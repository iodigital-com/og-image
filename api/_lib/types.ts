export type FileType = "png" | "jpeg";
export type BlendTheme = "blue" | "orange" | "rouge";

export interface ParsedRequest {
  fileType: FileType;
  blendTheme: BlendTheme;
  domain?: string;
  title: string;
  teaserImage?: string;
  author?: string;
  authorImage?: string;
  date?: string;
  locale?: string;
}
