import { IncomingMessage } from "http";
import { parse } from "url";
import { ParsedRequest } from "./types";

export function parseRequest(req: IncomingMessage) {
  console.log("HTTP " + req.url);
  const { pathname, query } = parse(req.url || "/", true);
  const { blendTheme, domain, teaserImage, author, authorImage, date, locale } =
    query || {};

  const arr = (pathname || "/").slice(1).split(".");
  let extension = "";
  let title = "";
  if (arr.length === 0) {
    title = "";
  } else if (arr.length === 1) {
    title = arr[0];
  } else {
    extension = arr.pop() as string;
    title = arr.join(".");
  }

  const parsedRequest: ParsedRequest = {
    fileType: extension === "jpeg" ? extension : "png",
    blendTheme: blendTheme as ParsedRequest["blendTheme"],
    domain: domain as ParsedRequest["domain"],
    title: decodeURIComponent(title),
    teaserImage: teaserImage as ParsedRequest["teaserImage"],
    author: author as ParsedRequest["author"],
    authorImage: authorImage as ParsedRequest["authorImage"],
    date: date as ParsedRequest["date"],
    locale: locale as ParsedRequest["locale"] || 'en',
  };
  return parsedRequest;
}
