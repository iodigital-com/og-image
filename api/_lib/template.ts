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
        background-image: url("data:image/jpg;base64,${blendFile}");
        background-repeat: no-repeat;
        background-size: cover;
        height: 100vh;
        width: 100vh;
        display: flex;
        align-items: stretch;
        justify-content: stretch;
        font-family: 'TTCommonsPro', sans-serif;
        font-weight: 500;
    }

    .aside {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;
        max-width: 35vw;
    }

    .aside_logo {
      width: 5vw;
    }

    .aside__header {
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
        gap: 1vw;
        padding: 5vw;
    }

    .aside__heading {
        font-family: 'TTCommonsPro', sans-serif;
        font-size: ${`${baseFontSize * 0.9}`}px;
        font-style: normal;
        font-weight: 500;
        color: white;
    }

    .aside__image {
      flex: 1;
      width: 35vw;
      max-height: 35vw;
      padding: 5vw;
      aspect-ratio: 1/1;
      object-fit: cover;
      border-top-right-radius: 100%;
    }

    .main {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: stretch;
        gap: 1vw;
        height: 100vh;
        min-width: 65vw;
        max-width: 65vw;
        width: 65vw;
        flex: 1;
        padding: 5vw;
    }

    main::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: white;
        opacity: 0.3;
    }

    .title {
        font-family: 'TTCommonsPro', sans-serif;
        font-size: ${`${baseFontSize * 1.25}`}px;
        font-style: normal;
        font-weight: 500;
        color: white;
        margin: 0;
        margin-top: auto;
        padding: 0;
        hyphens: auto;
        overflow: hidden;
        title-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .title img {
      height: ${`${baseFontSize * 1.25}`}px;
    }

    .title em,
    .title strong {
        font-family: 'Reckless', sans-serif;
    }

    .date {
        font-family: 'Reckless', sans-serif;
        font-size: ${`${baseFontSize * 0.8}`}px;
        font-style: normal;
        color: white;
    }

    .author {
        position: absolute;
        top: 5vw;
        right: 5vw;
        display: flex;
        align-items: center;
        gap: 1vw;
    }

    .author__image {
        width: 8vw;
        height: 8vw;
        object-fit: cover;
        border-radius: 100%;
    }

    .author__name {
        font-family: 'TTCommonsPro', sans-serif;
        font-size: ${`${baseFontSize * 0.8}`}px;
        font-style: normal;
        color: white;
    }
    `;
}

export function getHtml(parsedReq: ParsedRequest) {
  const { blendTheme, domain, title, teaserImage, author, authorImage, date } =
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
        <aside class="aside">
            <div class="aside__header">
                ${domain ? `<p class="aside__heading">${domain}</p>` : ""}
                <svg class="aside__logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 137.89 95.31"><defs><style>.cls-1{fill:#fff}</style></defs><g id="Layer_2" data-name="Layer 2"><g id="Lager_1" data-name="Lager 1"><path class="cls-1" d="M92.17 26.73a22.86 22.86 0 1 1-22.86 22.86 22.89 22.89 0 0 1 22.86-22.86m0-22.87a45.73 45.73 0 1 0 45.72 45.73A45.74 45.74 0 0 0 92.17 3.86ZM21.54 35.06 0 83.44l24.26 10.8L35 70.12a26.56 26.56 0 0 0-13.46-35.06ZM8.08 0a26.56 26.56 0 0 0 13.46 35.06l10.8-24.26Z"/></g></g></svg>
            </div>
            ${teaserImage ? getImage(teaserImage, "aside__image") : ""}
        </aside>
        <main class="main">
            <h1 class="title">
            ${emojify(marked(title))}
            </h1>
            ${
              date
                ? `<time class="date" date="${new Date(
                    date
                  )}">${new Intl.DateTimeFormat("en").format(
                    new Date(date)
                  )}</time>`
                : ""
            }
            <div class="author">
             ${authorImage ? getImage(authorImage, "author__image") : ""}
             ${author ? `<p class="author__name">${author}</p>` : ""}
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
