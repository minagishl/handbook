import { writeFileSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

function generateRedirects() {
  const docsDir = join(process.cwd(), "src/content/docs");
  const files = readdirSync(docsDir, { recursive: true });

  const docs = files
    .filter((file) => typeof file === "string" && file.endsWith(".md"))
    .map((file) => {
      const content = readFileSync(join(docsDir, file), "utf-8");
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

      if (!frontmatterMatch) return null;

      const frontmatter = frontmatterMatch[1];
      const titleMatch = frontmatter.match(/title:\s*["']?([^"'\n]+)["']?/);
      const orderMatch = frontmatter.match(/order:\s*(\d+)/);

      const slug = file.replace(/\.md$/, "").replace(/\\/g, "/");

      return {
        slug,
        title: titleMatch?.[1]?.trim() || "",
        order: orderMatch ? parseInt(orderMatch[1]) : 0,
      };
    })
    .filter((doc) => doc !== null);

  if (docs.length === 0) {
    console.log("No docs found, skipping _redirects generation");
    return;
  }

  const sorted = docs.sort((a, b) => {
    const orderDiff = a.order - b.order;
    return orderDiff !== 0 ? orderDiff : a.title.localeCompare(b.title);
  });

  const firstDoc = sorted[0];
  const redirects = `/ /docs/${firstDoc.slug} 302`;

  const distPath = join(process.cwd(), "dist", "_redirects");
  writeFileSync(distPath, redirects);

  console.log(
    `Generated _redirects file with redirect to /docs/${firstDoc.slug}`
  );
}

try {
  generateRedirects();
} catch (error) {
  console.error("Failed to generate _redirects:", error);
  process.exit(1);
}
