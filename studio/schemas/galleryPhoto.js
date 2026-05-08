export default {
  name: 'galleryPhoto',
  title: 'Gallery Photo',
  type: 'document',
  fields: [
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'caption',
      title: 'Caption (optional)',
      type: 'string',
      description: 'Optional. Shown if hovered or in the lightbox.',
    },
    {
      name: 'order',
      title: 'Display order',
      type: 'number',
      description: 'Lower numbers appear first. Try 10, 20, 30 for easy reordering later.',
      initialValue: 100,
    },
  ],
  preview: {
    select: { title: 'caption', media: 'image' },
    prepare({ title, media }) {
      return { title: title || 'Untitled gallery photo', media }
    },
  },
  orderings: [
    {
      title: 'Display order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Most recent first',
      name: 'createdDesc',
      by: [{ field: '_createdAt', direction: 'desc' }],
    },
  ],
}
