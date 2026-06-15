import { defineCollection, z } from "astro:content";

const releases = defineCollection({
	type: "content",
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			releaseDate: z.date(),
			cover: image(),
			coverAlt: z.string().optional(),
			summary: z.string().optional(),
			streaming: z
				.object({
					spotify: z.string().url().optional(),
					apple: z.string().url().optional(),
					youtube: z.string().url().optional(),
					amazon: z.string().url().optional(),
					bandcamp: z.string().url().optional(),
					tidal: z.string().url().optional(),
				})
				.optional(),
			video: z
				.object({
					src: z.string(),
					title: z.string().optional(),
				})
				.optional(),
			donation: z
				.object({
					heading: z.string().default("Share the Love"),
					intro: z.string().optional(),
					orgs: z.array(
						z.object({
							name: z.string(),
							description: z.string(),
							url: z.string().url(),
							cta: z.string().default("Donate"),
						})
					),
				})
				.optional(),
		}),
});

export const collections = { releases };
