import { readFileSync } from "fs";
import { marked } from "marked";
import { sanitizeHtml } from "./sanitizer";
import { BlendTheme, ParsedRequest } from "./types";
const twemoji = require("twemoji");
const twOptions = { folder: "svg", ext: ".svg" };
const emojify = (title: string) => twemoji.parse(title, twOptions);

const blendBlue = readFileSync(
  `${__dirname}/../_blends/io-blend-blue.jpg`
).toString("base64");
const blendOrange = readFileSync(
  `${__dirname}/../_blends/io-blend-orange.jpg`
).toString("base64");
const blendRouge = readFileSync(
  `${__dirname}/../_blends/io-blend-rouge.jpg`
).toString("base64");

const regular = readFileSync(
  `${__dirname}/../_fonts/TTCommonsPro-Regular.woff2`
).toString("base64");
const medium = readFileSync(
  `${__dirname}/../_fonts/TTCommonsPro-Medium.woff2`
).toString("base64");
const bold = readFileSync(
  `${__dirname}/../_fonts/TTCommonsPro-Bold.woff2`
).toString("base64");
const italic = readFileSync(
  `${__dirname}/../_fonts/Reckless-RegularItalic.woff2`
).toString("base64");

const italicLight = readFileSync(
  `${__dirname}/../_fonts/Reckless-LightItalic.woff2`
).toString("base64");

const getBlendFile = (blend: BlendTheme = "blue") => {
  switch (blend) {
    default:
    case "blue":
      return blendBlue;
    case "orange":
      return blendOrange;
    case "rouge":
      return blendRouge;
  }
};

function getCss(blendTheme: BlendTheme = "blue") {
  const blendFile = getBlendFile(blendTheme);
  const baseFontSize = 100;
  const marginDefault = '4vw';
  const colorLight = '#676767';

  return `
    @font-face {
        font-family: 'TTCommonsPro';
        src: url(data:font/woff2;charset=utf-8;base64,${regular})  format("woff2");
        font-style: normal;
        font-weight: 400;
    }

    @font-face {
        font-family: 'TTCommonsPro';
        src: url(data:font/woff2;charset=utf-8;base64,${medium})  format("woff2");
        font-style: normal;
        font-weight: 500;
    }

    @font-face {
        font-family: 'TTCommonsPro';
        src: url(data:font/woff2;charset=utf-8;base64,${bold})  format("woff2");
        font-style: normal;
        font-weight: 700;
    }

    @font-face {
        font-family: 'Reckless';
        src: url(data:font/woff2;charset=utf-8;base64,${italic})  format("woff2");
        font-weight: 300;
    }

    @font-face {
        font-family: 'Reckless';
        src: url(data:font/woff2;charset=utf-8;base64,${italicLight})  format("woff2");
        font-weight: 400;
    }

    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    body {
        background: white;
        height: 100vh;
        width: 100vw;
        display: flex;
        flex-direction: column;
        font-family: 'TTCommonsPro', sans-serif;
        font-weight: 500;
        color: #000;
    }

    .header {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 2vw;
        padding: ${marginDefault};
    }
    .header::before {
      content: '';
      position: absolute;
      top: 0;
      left: ${marginDefault};
      right: ${marginDefault};
      height: 2vh;
      background-image: url("data:image/jpg;base64,${blendFile}");
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
    }
    
    .header__logo {
      width: 8vw;
    }

    .header__title {
      font-size: ${`${baseFontSize * 0.6}`}px;
    }

    .teaserImage {
      position: absolute;
      right: ${marginDefault};
      bottom: ${marginDefault};
      width: 35vw;
      max-height: 35vw;
      aspect-ratio: 1/1;
      object-fit: cover;
      border-top-left-radius: 100%;
    }

    .main {
      position: relative;
      display: flex;
      flex-direction: column;
      min-width: 75vw;
      max-width: 75vw;
      width: 75vw;
      flex: 1;
      padding: 0 ${marginDefault} ${marginDefault} ${marginDefault};
    }

    .title {
        font-size: ${`${baseFontSize * 1.4}`}px;
        line-height: 1.1;
        font-weight: 700;
        hyphens: auto;
        overflow: hidden;
        title-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .title img {
      height: ${`${baseFontSize * 1.2}`}px;
    }

    .title em,
    .title strong {
        font-family: 'Reckless', sans-serif;
    }

    .author {
        display: flex;
        align-items: center;
        margin-top: auto;
        gap: 2vw;
    }

    .author__image {
        width: 8vw;
        height: 8vw;
        object-fit: cover;
        border-radius: 100%;
    }

    .author__prefix {
        font-size: ${`${baseFontSize * 0.5}`}px;
        color: ${colorLight};
    }

    .author__name {
        font-size: ${`${baseFontSize * 0.6}`}px;
    }
    `;
}

export function getHtml(parsedReq: ParsedRequest) {
  const { blendTheme, domain, title, teaserImage, author, authorImage } =
    parsedReq;

  return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(blendTheme)}
    </style>
    <body>
        <header class="header">
          <svg class="header__logo" xmlns="http://www.w3.org/2000/svg" width="50%" viewBox="0 0 137.89 95.31"><defs><style>.cls-1{fill:#000}</style></defs><g id="Layer_2" data-name="Layer 2"><g id="Lager_1" data-name="Lager 1"><path class="cls-1" d="M92.17 26.73a22.86 22.86 0 1 1-22.86 22.86 22.89 22.89 0 0 1 22.86-22.86m0-22.87a45.73 45.73 0 1 0 45.72 45.73A45.74 45.74 0 0 0 92.17 3.86ZM21.54 35.06 0 83.44l24.26 10.8L35 70.12a26.56 26.56 0 0 0-13.46-35.06ZM8.08 0a26.56 26.56 0 0 0 13.46 35.06l10.8-24.26Z"/></g></g></svg>
          ${domain ? `<p class="header__title">${domain}</p>` : ""}
        </header>
        ${teaserImage ? getImage(teaserImage, "teaserImage") : ""}
        <main class="main">
            <h1 class="title">
            ${emojify(marked(title))}
            </h1>
            <div class="author">
             ${authorImage ? getImage(authorImage, "author__image") : ""}
             ${author ? `<div><p class="author__prefix">written by</p><p class="author__name">${author}</p></div>` : ""}
            </div>
        </main>
    </body>
</html>`;
}

function getImage(src: string, className?: string) {
  return `<img
        class="${className}"
        alt="Generated Image"
        src="${sanitizeHtml(src)}"
    />`;
}
