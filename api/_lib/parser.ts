import { IncomingMessage } from "http";
import { parse } from "url";
import { ParsedRequest } from "./types";

export function parseRequest(req: IncomingMessage) {
  console.log("HTTP " + req.url);
  const { pathname, query } = parse(req.url || "/", true);
  const { domain, teaserImage, author, authorImage, date } = query || {};

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
    domain: domain as ParsedRequest["domain"],
    title: decodeURIComponent(title),
    teaserImage: teaserImage as ParsedRequest["teaserImage"],
    author: author as ParsedRequest["author"],
    authorImage: authorImage as ParsedRequest["authorImage"],
    date: date as ParsedRequest["date"],
  };
  return parsedRequest;
}
