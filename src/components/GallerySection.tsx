import React from 'react';

// Static gallery items for Community / Gallery section
const galleryItems = [
  {
    src: '/images/services/leadership-trainer.jpg',
    alt: 'Leadership seminar delivered to professionals',
    label: 'Leadership Campaign',
    title: 'Leadership Campaign',
    description: 'Empowering leaders through insightful seminars and workshops that drive impactful change.',
  },
  {
    src: '/images/services/business-outreach-group.jpeg',
    alt: 'Business education session with participants',
    label: 'Business Education',
    title: 'Business Education',
    description: 'Delivering business education sessions and workshops to inspire entrepreneurship and growth.',
  },
  {
    src: '/images/services/school-kit-distribution.jpeg',
    alt: 'School kit distribution during a community programme',
    label: 'School Support',
    title: 'School Support',
    description: 'Providing essential supplies and support to schools to foster learning environments.',
  },
  {
    src: '/images/services/community-school-support.jpeg',
    alt: 'School children receiving backpacks through community support',
    label: 'School Support',
    title: 'School Support',
    description: 'Engaging communities to back school initiatives and improve student wellbeing.',
  },
];

export default function GallerySection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="community-gallery">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {galleryItems.map((item, idx) => (
          <div
            key={idx}
            className="relative rounded-2xl overflow-hidden shadow-xl group hover:shadow-2xl transition-shadow duration-300"
          >
            <img
              src={item.src}
              alt={item.alt}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-60 group-hover:opacity-70 transition-opacity" />
            {/* Category badge */}
            <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-md px-2 py-1 rounded-full text-xs font-bold uppercase text-white">
              {item.label}
            </div>
            {/* Title and description */}
            <div className="absolute bottom-3 left-3 text-white space-y-1">
              <h3 className="text-lg font-semibold leading-snug">{item.title}</h3>
              <p className="text-sm leading-snug max-w-xs">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
