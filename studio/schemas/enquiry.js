export default {
  name: 'enquiry',
  title: 'Enquiry',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Full name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    },
    {
      name: 'phone',
      title: 'Phone',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'park',
      title: 'Preferred park',
      type: 'string',
    },
    {
      name: 'date',
      title: 'Preferred date',
      type: 'string',
    },
    {
      name: 'guests',
      title: 'Guests',
      type: 'string',
    },
    {
      name: 'message',
      title: 'Message',
      type: 'text',
      rows: 4,
    },
    {
      name: 'submittedAt',
      title: 'Submitted at',
      type: 'datetime',
      readOnly: true,
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'Contacted', value: 'contacted' },
          { title: 'Booked', value: 'booked' },
          { title: 'Closed', value: 'closed' },
        ],
        layout: 'radio',
      },
      initialValue: 'new',
    },
    {
      name: 'notes',
      title: 'Internal notes',
      type: 'text',
      rows: 3,
      description: 'Private — only visible in the Studio',
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'park',
      status: 'status',
    },
    prepare({ title, subtitle, status }) {
      return {
        title: title || 'Unnamed enquiry',
        subtitle: [status?.toUpperCase(), subtitle].filter(Boolean).join(' · '),
      }
    },
  },
  orderings: [
    {
      title: 'Most recent first',
      name: 'submittedAtDesc',
      by: [{ field: 'submittedAt', direction: 'desc' }],
    },
  ],
}
