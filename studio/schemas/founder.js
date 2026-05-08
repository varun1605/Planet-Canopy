export default {
  name: 'founder',
  title: 'Founder',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'role',
      title: 'Role',
      type: 'string',
      description: 'e.g. "Co-Founder & Safari Expert"',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
      description: 'Headshot. Set the hotspot on the face for best cropping.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'bio',
      title: 'Short bio',
      type: 'text',
      rows: 3,
      description: '1–2 sentences shown beside the photo.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'instagram',
      title: 'Instagram URL',
      type: 'url',
      description: 'Optional. Full URL, e.g. https://instagram.com/yourhandle',
    },
    {
      name: 'linkedin',
      title: 'LinkedIn URL',
      type: 'url',
      description: 'Optional. Full URL, e.g. https://linkedin.com/in/yourhandle',
    },
    {
      name: 'order',
      title: 'Display order',
      type: 'number',
      description: 'Lower numbers appear first. Try 10, 20.',
      initialValue: 10,
    },
  ],
  preview: {
    select: { title: 'name', subtitle: 'role', media: 'image' },
  },
  orderings: [
    {
      title: 'Display order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
}
