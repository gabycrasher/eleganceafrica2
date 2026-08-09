(function attachCatalog(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.EleganceCatalog = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function createCatalog() {
  const products = [
    {
      id: 'amara-coil', name: 'The Amara Coil', category: 'Hair',
      tags: ['curly', 'bob'], featured: true, price: 'Price on request',
      images: ['assets/images/amara-coil-1.jpeg', 'assets/images/amara-coil-2.jpeg', 'assets/images/amara-coil-3.jpeg'],
      description: 'A softly rounded, textured look with natural volume and an expressive silhouette.',
      wearItHow: 'Wear it with a simple neckline when you want a textured look to carry the occasion.',
      lengths: ['12"', '14"', '16"', '18"'],
      densities: ['130%', '150%', '180%'],
      availability: 'Options and availability are confirmed personally on WhatsApp.',
      care: 'Detangle gently in sections and ask our team for care guidance suited to your selected piece.'
    },
    {
      id: 'zuri-straight', name: 'The Zuri Straight', category: 'Hair',
      tags: ['straight'], featured: true, price: 'Price on request',
      images: ['assets/images/zuri-straight-1.jpeg', 'assets/images/zuri-straight-2.jpeg', 'assets/images/zuri-straight-3.jpeg'],
      description: 'A polished straight finish with a smooth fall and warm, dimensional colour.',
      wearItHow: 'Wear it sleek for polished daytime plans or a refined evening entrance.',
      lengths: ['12"', '14"', '16"', '18"'],
      densities: ['130%', '150%', '180%'],
      availability: 'Options and availability are confirmed personally on WhatsApp.',
      care: 'Store neatly between wears and use heat only after confirming the right care routine with our team.'
    },
    {
      id: 'nia-wave', name: 'The Nia Wave', category: 'Hair',
      tags: ['wavy'], featured: true, price: 'Price on request',
      images: ['assets/images/nia-wave-1.jpeg', 'assets/images/nia-wave-2.jpeg', 'assets/images/nia-wave-3.jpeg'],
      description: 'A flowing dark wave designed for soft movement, volume, and an elegant finish.',
      wearItHow: 'Wear it for an evening occasion with soft makeup and a clean, understated neckline.',
      lengths: ['12"', '14"', '16"', '18"'],
      densities: ['130%', '150%', '180%'],
      availability: 'Options and availability are confirmed personally on WhatsApp.',
      care: 'Use a wide-tooth comb, begin at the ends, and keep the wave pattern supported between wears.'
    },
    {
      id: 'imani-crop', name: 'The Imani Crop', category: 'Hair',
      tags: ['curly', 'bob'], featured: false, price: 'Price on request',
      images: ['assets/images/imani-crop-1.jpeg', 'assets/images/imani-crop-2.jpeg', 'assets/images/imani-crop-3.jpeg'],
      description: 'A short sculpted curl with lively definition and an effortlessly confident profile.',
      wearItHow: 'Wear it with sculptural earrings when you want the short silhouette to frame your face.',
      lengths: ['12"', '14"', '16"', '18"'],
      densities: ['130%', '150%', '180%'],
      availability: 'Options and availability are confirmed personally on WhatsApp.',
      care: 'Refresh curls lightly, avoid aggressive brushing, and reshape with your fingers as needed.'
    },
    {
      id: 'sanaa-burgundy', name: 'The Sanaa Burgundy', category: 'Hair',
      tags: ['curly', 'statement'], featured: true, price: 'Price on request',
      images: ['assets/images/sanaa-burgundy-1.jpeg', 'assets/images/sanaa-burgundy-2.jpeg', 'assets/images/sanaa-burgundy-3.jpeg'],
      description: 'A statement curl in a deep burgundy tone, balancing softness with unmistakable presence.',
      wearItHow: 'Wear it for a bold occasion with a neutral outfit that lets the burgundy tone take focus.',
      lengths: ['12"', '14"', '16"', '18"'],
      densities: ['130%', '150%', '180%'],
      availability: 'Options and availability are confirmed personally on WhatsApp.',
      care: 'Separate curls gently and ask our team about colour-conscious care before using new products.'
    },
    {
      id: 'aya-bob', name: 'The Aya Bob', category: 'Hair',
      tags: ['straight', 'bob', 'statement'], featured: true, price: 'Price on request',
      images: ['assets/images/aya-bob-1.jpeg', 'assets/images/aya-bob-2.jpeg', 'assets/images/aya-bob-3.jpeg', 'assets/images/aya-bob-4.jpeg'],
      description: 'A refined rounded bob with a sleek finish and warm brunette depth.',
      wearItHow: 'Wear it with a tailored look for a confident occasion that calls for a clean silhouette.',
      lengths: ['12"', '14"', '16"', '18"'],
      densities: ['130%', '150%', '180%'],
      availability: 'Options and availability are confirmed personally on WhatsApp.',
      care: 'Keep the shape smooth, store on a suitable stand, and confirm styling guidance before applying heat.'
    }
  ];

  function filterProducts(tag = 'all') {
    return tag === 'all' ? [...products] : products.filter((product) => product.tags.includes(tag));
  }

  function getProductById(id) {
    return products.find((product) => product.id === id);
  }

  function recommendProduct({ texture, occasion, preference }) {
    const id = texture === 'straight' ? 'zuri-straight'
      : texture === 'curly' && preference === 'bold' ? 'sanaa-burgundy'
      : texture === 'curly' ? 'amara-coil'
      : texture === 'short' ? 'aya-bob'
      : 'nia-wave';
    return getProductById(id);
  }

  function buildWhatsAppUrl(productName, options = {}) {
    const choices = [options.length && `Length: ${options.length}`, options.density && `Density: ${options.density}`].filter(Boolean);
    const message = `Hello Elegance Africa, I'm interested in ${productName}.${choices.length ? ` ${choices.join(', ')}.` : ''} Please share the available options and price.`;
    return `https://wa.me/256765897583?text=${encodeURIComponent(message)}`;
  }

  return { products, filterProducts, getProductById, recommendProduct, buildWhatsAppUrl };
}));
