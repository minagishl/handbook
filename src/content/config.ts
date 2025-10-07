import { defineCollection, z } from "astro:content";

const docs = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    group: z.string().default("Guides"),
    order: z.number().int().nonnegative().default(0),
    tags: z.array(z.string()).default([]),
    sidebar: z
      .object({
        icon: z.string().optional(),
        hidden: z.boolean().optional(),
      })
      .partial()
      .optional(),
  }),
});

export const collections = { docs };
