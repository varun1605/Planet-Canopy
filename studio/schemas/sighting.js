export default {
  name: 'sighting',
  title: 'Sighting',
  type: 'document',
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
        'Toggle ON and click Publish to make this sighting visible. Leave OFF to keep it private.',
      initialValue: false,
      fieldset: 'moderation',
    },
    {
      name: 'park',
      title: 'Park / Reserve',
      type: 'string',
      options: {
        list: [
          'Bandhavgarh National Park',
          'Ranthambore National Park',
          'Kanha National Park',
          'Pench National Park',
          'Tadoba Andhari Tiger Reserve',
          'Jim Corbett National Park',
          'Kaziranga National Park',
          'Sundarbans National Park',
          'Gir National Park',
          'Satpura National Park',
          'Nagarhole National Park',
          'Bandipur National Park',
          'Periyar Tiger Reserve',
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'zone',
      title: 'Zone (optional)',
      type: 'string',
      description: 'e.g. "Khitauli", "Magdhi", "Tala". Leave blank if not applicable.',
    },
    {
      name: 'species',
      title: 'Species',
      type: 'string',
      description: 'e.g. Tiger, Leopard, Sloth Bear, Asian Elephant',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'individual',
      title: 'Individual (optional)',
      type: 'string',
      description: 'Specific animal identifier, e.g. "D1 male", "Maya", "Tara"',
    },
    {
      name: 'description',
      title: 'What happened',
      type: 'text',
      rows: 4,
      description: 'The sighting details, exactly as you want them shown publicly.',
      validation: (Rule) => Rule.required().min(10),
    },
    {
      name: 'sightedAt',
      title: 'When sighted',
      type: 'date',
      options: { dateFormat: 'YYYY-MM-DD' },
      description: 'The date the sighting happened.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'reportedBy',
      title: 'Reported by (optional)',
      type: 'string',
      description: 'Guide or naturalist name. Shown publicly if filled.',
    },
    {
      name: 'image',
      title: 'Photo (optional)',
      type: 'image',
      options: { hotspot: true },
      description: 'Optional photograph of the sighting. Drag-drop a JPG/PNG.',
    },
  ],
  preview: {
    select: {
      park: 'park',
      species: 'species',
      individual: 'individual',
      sightedAt: 'sightedAt',
      approved: 'approved',
      media: 'image',
    },
    prepare({ park, species, individual, sightedAt, approved, media }) {
      const flag = approved ? '✓ Live' : '⏳ Pending'
      const date = sightedAt
        ? new Date(sightedAt).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
          })
        : ''
      const subject = [species, individual].filter(Boolean).join(' — ')
      return {
        title: `${flag} — ${subject || 'Sighting'}`,
        subtitle: [date, park].filter(Boolean).join(' · '),
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Most recent sightings first',
      name: 'recent',
      by: [{ field: 'sightedAt', direction: 'desc' }],
    },
    {
      title: 'Pending first, then recent',
      name: 'pendingFirst',
      by: [
        { field: 'approved', direction: 'asc' },
        { field: 'sightedAt', direction: 'desc' },
      ],
    },
  ],
}
