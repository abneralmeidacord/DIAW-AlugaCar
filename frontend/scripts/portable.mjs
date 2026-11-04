import fs from "node:fs";
import path from "node:path";
const root = process.cwd(),
  dist = path.join(root, "dist");
const fallbackImage =
  "data:image/svg+xml;base64," +
  fs.readFileSync(path.join(root, "public/images/car-fallback.svg")).toString("base64");
let html = fs.readFileSync(path.join(dist, "index.html"), "utf8");
html = html.replace(
  /<script\b[^>]*src="([^"]+)"[^>]*><\/script>/g,
  (_match, url) => {
    const file = path.join(dist, url.replace(/^\//, ""));
    const code = fs
      .readFileSync(file, "utf8")
      .replaceAll("/images/car-fallback.svg", fallbackImage)
      .replace(/<\/script/gi, "<\\/script");
    return '<script type="module">' + code + "</script>";
  },
);
html = html.replace(
  /<link\b[^>]*href="([^"]+\.css)"[^>]*>/g,
  (_match, url) =>
    "<style>" +
    fs.readFileSync(path.join(dist, url.replace(/^\//, "")), "utf8") +
    "</style>",
);
const output = path.join(root, "AlugaCar_Prototipo.html");
fs.writeFileSync(output, html);
console.log("Versão portátil gerada: AlugaCar_Prototipo.html");
