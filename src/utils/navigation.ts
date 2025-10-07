import type { CollectionEntry } from "astro:content";

export type NavigationItem = {
  slug: string;
  title: string;
  description?: string;
  group: string;
  order: number;
};

export type NavigationGroup = {
  title: string;
  items: NavigationItem[];
};

export function buildNavigation(
  entries: CollectionEntry<"docs">[]
): NavigationGroup[] {
  const filtered = entries.filter(
    (entry) => entry.data.sidebar?.hidden !== true
  );
  const groups = new Map<string, NavigationItem[]>();

  for (const entry of filtered) {
    const groupName = entry.data.group ?? "Guides";
    const item: NavigationItem = {
      slug: `/docs/${entry.slug}`,
      title: entry.data.title,
      description: entry.data.description,
      group: groupName,
      order: entry.data.order ?? 0,
    };

    const existing = groups.get(groupName) ?? [];
    existing.push(item);
    groups.set(groupName, existing);
  }

  return Array.from(groups.entries())
    .map(([title, items]) => ({
      title,
      items: items.sort(
        (a, b) => a.order - b.order || a.title.localeCompare(b.title)
      ),
    }))
    .sort((a, b) => {
      const firstOrder = a.items[0]?.order ?? 0;
      const secondOrder = b.items[0]?.order ?? 0;
      if (firstOrder === secondOrder) {
        return a.title.localeCompare(b.title);
      }
      return firstOrder - secondOrder;
    });
}

export function findNeighbors(
  navigation: NavigationGroup[],
  currentSlug: string
) {
  const flat = navigation.flatMap((group) => group.items);
  const index = flat.findIndex((item) => item.slug === currentSlug);

  return {
    previous: index > 0 ? flat[index - 1] : null,
    next: index >= 0 && index < flat.length - 1 ? flat[index + 1] : null,
  } as const;
}
