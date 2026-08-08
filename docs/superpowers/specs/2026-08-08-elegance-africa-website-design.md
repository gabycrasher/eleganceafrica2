# Elegance Africa Website Design Specification

## Project Goal

Create a premium, responsive static website for Elegance Africa using HTML, CSS, JavaScript, and Bootstrap. The site will present the business as an online African beauty and lifestyle brand, launch with a hair-focused catalogue built from the supplied imagery, and direct product enquiries to WhatsApp until the client supplies final names, prices, stock, and payment details.

The design will take useful structural cues from Salon Iremía—clear conversion paths, curated work, social proof, and prominent WhatsApp access—while establishing an original editorial identity for Elegance Africa.

## Brand Foundation

- Brand: Elegance Africa
- Primary English message: “More than a brand. A signature.”
- Supporting French slogan: “Élégance Africa, plus qu’une marque, une signature.”
- Positioning: a modern African beauty and lifestyle brand for women who value elegance, confidence, femininity, quality, and personal expression.
- Personality: elegant, feminine, sophisticated, modern, African, glamorous, confident, warm, premium, and authentic.
- Customer promise: carefully selected products, beautiful presentation, thoughtful service, and an experience that feels special from discovery through delivery.

## Business Information

- Business model: online-only; the site will not advertise a physical storefront.
- WhatsApp and phone: +256 765 897 583
- Email: eeleganceafrica@gmail.com
- Initial ordering model: product enquiry through WhatsApp.
- Initial pricing model: “Price on request.”
- Future commerce model: product names, prices, stock, variants, and payment features can replace the temporary catalogue data when supplied by the client.

## Recommended Site Architecture

The site will be a multi-page static catalogue with shared navigation, branding, footer, and JavaScript data.

### Home

The homepage will contain:

1. A compact announcement bar and responsive navigation.
2. A cinematic hero with the brand slogan, two calls to action, and a strong supplied image.
3. A featured/new-arrivals hair edit.
4. A Shop by Category preview for Hair, Fragrance, Beauty, and Accessories. Hair will be live; the other categories will communicate that the brand is expanding.
5. A concise Elegance Africa story section.
6. “Why Elegance Africa?” with Quality, Elegance, Carefully Selected, and Customer Experience.
7. The Elegance Experience, centered on presentation, care, packaging, and delivery.
8. “Find Your Signature,” with Hair, Fragrance, and Beauty pathways.
9. A best-sellers or signature-edit product row.
10. Customer-review cards clearly presented as layout-ready sample content rather than verified customer claims.
11. A social-media invitation for Instagram, TikTok, and Facebook without invented profile links.
12. A newsletter invitation with local front-end validation and a clear non-sending confirmation state.
13. A complete footer with contact, navigation, support, and policy links.

### Shop

The Shop page will provide:

- A refined collection introduction.
- Filter controls for All, Curly, Straight, Wavy, Bob, and Statement Colour where supported by the supplied images.
- A responsive product grid sourced from one JavaScript catalogue.
- Product cards with image, temporary editorial name, type or texture, “Price on request,” and enquiry/detail actions.
- Visible future category panels for Fragrance, Beauty, and Accessories without fake products.
- An empty-results state and a reset-filter action.

### Product Detail

One reusable product page will read the selected product identifier from the URL and populate:

- A main product image and selectable secondary images.
- Temporary editorial product name and category.
- “Price on request.”
- A concise description based only on visually supportable attributes.
- Available-length enquiry instead of invented length stock.
- Stock confirmation language that directs the visitor to WhatsApp.
- Care guidance and delivery summary.
- An “Enquire on WhatsApp” action with a pre-filled product-specific message.
- A related-products row.
- A graceful product-not-found state for unknown identifiers.

### About

The About page will distill the supplied long-form brief into visually paced sections covering:

- The Elegance Africa story.
- Vision and philosophy.
- The modern African woman.
- African identity and ambition.
- Quality and curation.
- The meaning of “More than a brand. A signature.”

### Delivery and FAQ

This support page will explain that Elegance Africa can discuss Kampala, Uganda-wide, and international/African delivery by enquiry. It will not invent fees or delivery times. The FAQ will address ordering, payment confirmation, delivery, product availability, exchanges, hair care, fragrance, and support using Bootstrap accordions.

### Contact

The Contact page will include:

- WhatsApp and phone contact.
- Email contact.
- Online-business availability language without a street address.
- A front-end enquiry form with validation.
- A mailto fallback that carries the completed subject and message when possible.
- Social platform labels prepared for final profile links.

### Policies

A shared policies page will provide concise starter sections for Privacy, Terms and Conditions, Returns and Exchanges, and Shipping. It will state that final commercial terms must be confirmed by the business before launch and will not present unconfirmed rules as binding facts.

## Visual Design System

### Colour

- Obsidian black for premium framing and high-impact sections.
- Soft charcoal for depth and layered surfaces.
- Warm ivory and cream for readable editorial sections.
- Muted champagne gold for fine rules, labels, buttons, and selected highlights.
- Warm taupe and cocoa neutrals drawn from the supplied photography.

Gold will be used sparingly to maintain sophistication and adequate contrast. Body text will not use low-contrast gold on light backgrounds.

### Typography

- An elegant display serif for hero statements and major section titles.
- A clean modern sans-serif for body copy, navigation, forms, prices, and interface labels.
- Fluid type sizes will preserve impact on desktop without overwhelming mobile screens.

If web fonts are loaded, the site will include sensible system fallbacks so content remains readable if the font request fails.

### Layout and Imagery

- The layout will combine Bootstrap’s responsive grid with custom editorial compositions.
- Dark and light sections will alternate to create rhythm.
- Product photography will use consistent aspect ratios and careful `object-fit` crops.
- The supplied black-and-gold logo image will appear in the navigation and footer.
- The hero will use a strong hair image with a controlled dark overlay and separate readable text rather than embedding text into the photo.
- Product grids will use asymmetric spacing, restrained borders, and magazine-style labels instead of generic marketplace cards.
- The design will avoid decorative SVG illustrations; typography, photography, CSS lines, and Bootstrap Icons will provide visual detail.

### Motion

- Subtle fade and upward reveal effects will run once as sections enter the viewport.
- Cards and buttons may use small hover translations or image-scale changes.
- Navigation and filters will have quick, calm transitions.
- Motion will respect `prefers-reduced-motion` and remain nonessential to understanding or navigation.

## Responsive and Accessible Behaviour

- The design will be mobile-first and tested at phone, tablet, laptop, and wide-screen sizes.
- Navigation will collapse into an accessible Bootstrap offcanvas or menu on smaller screens.
- Touch targets will be comfortably sized.
- All meaningful images will have descriptive alternative text; decorative images will use empty alternative text.
- Visible keyboard focus states will be preserved.
- Forms will use explicit labels, helpful error messages, and appropriate input types.
- Colour contrast and content order will remain usable across light and dark sections.
- The floating WhatsApp control will not obscure primary content on small screens.

## Catalogue Data and Interactions

Product information will live in one JavaScript data structure. Each product record will support:

- Stable identifier.
- Temporary editorial name.
- Category and filter tags.
- Primary and secondary local image paths.
- Description.
- Price label.
- Availability message.
- Care notes.

The temporary names will be tasteful and easy to replace. No temporary name will claim a material, origin, length, or specification that cannot be verified from the image.

JavaScript will provide:

- Catalogue rendering and filtering.
- Product-detail population from the URL identifier.
- Gallery thumbnail selection.
- Related-product selection.
- Product-specific WhatsApp messages.
- Mobile navigation enhancements where Bootstrap does not cover them.
- FAQ behaviour through Bootstrap.
- Front-end form and newsletter validation.
- Scroll-reveal effects using Intersection Observer with a no-animation fallback.

The WhatsApp link will use the international number `256765897583` and a pre-filled message such as: “Hello Elegance Africa, I’m interested in [product name]. Please share the available options and price.”

## Error and Fallback States

- Unknown product identifiers will show a friendly product-not-found panel with links to the Shop and WhatsApp.
- Missing product images will fall back to the supplied brand logo and keep descriptive text visible.
- Empty filter results will offer a clear reset action.
- Forms will not imply that a server received a message; they will clearly open the visitor’s email application or direct them to WhatsApp.
- Newsletter submission will validate the address and explain that full newsletter integration can be connected later.
- Unavailable social profile URLs will not be replaced with invented links.
- External links will use safe attributes when opened in a new tab.

## Technical Structure

The implementation will use:

- Semantic HTML5 pages.
- One shared custom CSS file built around design tokens and Bootstrap overrides.
- One shared JavaScript catalogue file and one shared interaction script, with page-specific logic guarded by element checks.
- Bootstrap CSS and JavaScript from the official CDN.
- Bootstrap Icons from the official CDN.
- Local supplied image files organized under an `assets/images` directory with web-friendly filenames.

Planned pages and files:

- `index.html`
- `shop.html`
- `product.html`
- `about.html`
- `delivery-faq.html`
- `contact.html`
- `policies.html`
- `assets/css/styles.css`
- `assets/js/products.js`
- `assets/js/main.js`
- `assets/images/*`

The pages will work as a conventional static directory without a build system or framework.

## Verification Plan

Before completion, verify:

1. Every internal navigation link and policy anchor.
2. Catalogue filters, reset behaviour, and empty state.
3. Every product-detail link and unknown-product fallback.
4. Product gallery selection and related products.
5. WhatsApp URL formatting, phone number, and pre-filled messages.
6. Email links and contact-form fallback behaviour.
7. Newsletter validation and non-sending disclosure.
8. Bootstrap navigation and FAQ interaction.
9. Keyboard navigation, labels, focus states, alternative text, and reduced-motion behaviour.
10. Layout integrity at representative mobile, tablet, laptop, and desktop widths.
11. Absence of broken local images, missing files, and unintended horizontal scrolling.
12. HTML, CSS, and JavaScript syntax with available local validation tools.

## Out of Scope for This Static Version

- A database, admin dashboard, or customer accounts.
- Real cart, checkout, or payment processing.
- Automatic stock tracking.
- Server-side contact or newsletter delivery.
- Live social feeds.
- Final legal advice or binding policy language.
- Unconfirmed product specifications, names, prices, delivery fees, delivery times, or social account URLs.

These capabilities can be added after the client provides the required business data and approves an appropriate backend or third-party service.
