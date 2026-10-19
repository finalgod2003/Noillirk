import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { createServer } from "vite";

const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: "custom" });
const escape = (value) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
try {
  const { renderPages } = await server.ssrLoadModule("/src/prerender.tsx");
  const template = await readFile("dist/index.html", "utf8");
  const pages = renderPages();
  for (const page of pages) {
    let html = template.replace('<div id="root"></div>', () => `<div id="root">${page.html}</div>`);
    if (page.path !== "/") {
      html = html
        .replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(page.title)}</title>`)
        .replace(/(<meta\s+name="description"\s+content=")[^"]*("\s*\/?>)/, `$1${escape(page.description)}$2`)
        .replace(/(<meta\s+property="og:title"\s+content=")[^"]*("\s*\/?>)/, `$1${escape(page.title)}$2`)
        .replace(/(<meta\s+property="og:description"\s+content=")[^"]*("\s*\/?>)/, `$1${escape(page.description)}$2`)
        .replace(/(<link rel="canonical" href=")[^"]*("\s*\/?>)/, `$1https://noillirk.games${page.path}$2`)
        .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, () => `<script type="application/ld+json">${JSON.stringify({
          "@context": "https://schema.org", "@type": "WebPage", name: page.heading,
          description: page.description, url: `https://noillirk.games${page.path}`
        }).replace(/</g, "\\u003c")}</script>`);
    }
    const file = resolve("dist", `.${page.path}`, "index.html");
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, html);
  }
  await writeFile("dist/sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((page) => `  <url><loc>https://noillirk.games${page.path}</loc></url>`).join("\n")}\n</urlset>\n`);
  console.log(`Prerendered ${pages.length} pages with body content, metadata, and sitemap.`);
} finally {
  await server.close();
}
