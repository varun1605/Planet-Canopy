export default {
  name: 'review',
  title: 'Review',
  type: 'document',
  // Show "Approved" first so the owner can't miss it.
  fieldsets: [
    {
      name: 'moderation',
      title: 'Moderation',
      options: { collapsible: false },
    },
  ],
  fields: [
    {
      name: 'approved',
      title: '✅ Approved — show on public website',
      type: 'boolean',
      description:
        'Toggle ON and click Publish to make this review visible on the website. Leave OFF to keep it private.',
      initialValue: false,
      fieldset: 'moderation',
    },
    {
      name: 'name',
      title: 'Reviewer name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'location',
      title: 'Location (optional)',
      type: 'string',
      description: 'e.g. "Mumbai" or "London, UK"',
    },
    {
      name: 'rating',
      title: 'Rating',
      type: 'number',
      description: '1 to 5 stars',
      validation: (Rule) => Rule.required().integer().min(1).max(5),
    },
    {
      name: 'journey',
      title: 'Trip / Journey (optional)',
      type: 'string',
      description: 'e.g. "Ranthambore Safari"',
    },
    {
      name: 'review',
      title: 'Review text',
      type: 'text',
      rows: 5,
      validation: (Rule) => Rule.required().min(10),
    },
    {
      name: 'submittedAt',
      title: 'Submitted at',
      type: 'datetime',
      readOnly: true,
    },
    {
      name: 'moderationNotes',
      title: 'Moderation notes (private)',
      type: 'text',
      rows: 2,
      description: 'Internal notes — never shown publicly.',
    },
  ],
  preview: {
    select: { name: 'name', rating: 'rating', approved: 'approved', journey: 'journey' },
    prepare({ name, rating, approved, journey }) {
      const stars = '★'.repeat(rating || 0) + '☆'.repeat(Math.max(0, 5 - (rating || 0)))
      const flag = approved ? '✓ Live' : '⏳ Pending'
      return {
        title: `${flag} — ${name || 'Unnamed'}`,
        subtitle: [stars, journey].filter(Boolean).join(' · '),
      }
    },
  },
  orderings: [
    {
      title: 'Pending first, then most recent',
      name: 'pendingFirst',
      by: [
        { field: 'approved', direction: 'asc' },
        { field: 'submittedAt', direction: 'desc' },
      ],
    },
    {
      title: 'Most recent first',
      name: 'recent',
      by: [{ field: 'submittedAt', direction: 'desc' }],
    },
  ],
}
