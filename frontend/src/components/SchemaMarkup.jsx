import React from 'react';

const LOGO_URL = 'https://customer-assets.emergentagent.com/job_nexus-arena-11/artifacts/vefp23lc_ArenaKore-logo-dark-bg.png';

const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ArenaKore",
    "url": "https://arenakore.com",
    "logo": LOGO_URL,
    "description": "ArenaKore is a fitness competition platform that turns workouts into daily challenges with rankings and performance tracking.",
    "sameAs": []
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ArenaKore",
    "url": "https://arenakore.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://arenakore.com/?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }
];

export default function SchemaMarkup() {
  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
