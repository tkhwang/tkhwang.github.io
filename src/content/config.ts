import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	type: 'content',
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			seoTitle: z.string().optional(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date().transform((date) => {
				return new Date(date.getTime() + 9 * 60 * 60 * 1000);
			}),
			updatedDate: z.coerce
				.date()
				.transform((date) => {
					return date ? new Date(date.getTime() + 9 * 60 * 60 * 1000) : undefined;
				})
				.optional(),
			tags: z.array(z.string()).optional(),
			coverImage: image()
				.refine((img) => img.width >= 960, {
					message: 'Cover image must be at least 960 pixels wide!'
				})
				.optional()
		})
});

export const collections = { blog };
