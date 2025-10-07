import { getCollection } from "astro:content";

function stripMarkdown(value: string): string {
  return value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_~`-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function GET() {
  const docs = await getCollection("docs");

  const searchable = docs.map((entry) => {
    const { title, description = "", group = "Guides", tags = [] } = entry.data;
    const slug = `/docs/${entry.slug}`;
    const content = stripMarkdown(entry.body);

    const excerpt = content.slice(0, 200).replace(/\s+\S*$/, "");

    return {
      slug,
      title,
      description,
      group,
      tags,
      content,
      excerpt,
    } as const;
  });

  return new Response(JSON.stringify(searchable), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
