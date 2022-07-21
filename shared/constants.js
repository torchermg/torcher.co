const CDN = `${process.env.CDN}`;

export default {
  CDN,
  ADDRESS: "https://torcher.co",
  CONTACT_EMAIL: "mail@torcher.co",
  CLEARANCE_EMAIL: "mail@torcher.co",
  INSTAGRAM_URL: "https://instagram.com/torchermg",
  INSTAGRAM_HANDLE: "@torchermg",
  COPYRIGHT: "© 2022 Torcher Music Group LLC",
  ASSETS: {
    IMAGES: {
      HERO_MIHAILO_WIDE: `${CDN}/hero-mihailo-wide.jpeg`,
      HERO_MIHAILO_TALL: `${CDN}/hero-mihailo-wide.jpeg`,
    },
    LEGAL: {
      "terms-of-service": `${CDN}/terms-of-service.html`,
      "privacy-policy": `${CDN}/privacy-policy.html`,
    },
  },
};
