# Elegance Africa hybrid motion and design upgrade

## Direction

Elevate Elegance Africa into a modern editorial-luxury experience informed by the requested design libraries: generous 21st/Skiper-style spacing and tactile cards, Vengeance-like layered depth, Animmaster-inspired timed transitions, and Stitch-style visual hierarchy. The existing black, ivory, cream, and gold brand system remains the visual foundation.

## Motion system

The default experience uses restrained motion: staggered section reveals, image zoom/crop transitions, polished button and card hover states, a slowly animated announcement line, and subtle gold highlight sweeps. High-intent moments receive stronger animation: hero typography entrance, product-card media interactions, quiz-result reveal, and the floating WhatsApp CTA.

Motion runs only after JavaScript is ready and must honor `prefers-reduced-motion`. It must not block navigation, hide meaningful content when JavaScript is unavailable, or use a third-party animation dependency.

## Experience upgrades

- Add an opening page-transition overlay and a lightweight scroll-progress indicator.
- Restyle the homepage hero with editorial framing, animated accent treatment, and elevated CTA hierarchy.
- Upgrade product cards with media depth, label movement, and a clear static fallback.
- Make the Signature quiz result feel celebratory without impeding selection or keyboard flow.
- Add a local-only recently viewed product strip, saved in `localStorage`, with safe handling when storage is unavailable.
- Create an auto-advancing inspiration rail from existing product imagery, with pause-on-hover/focus, controls, and reduced-motion behavior.
- Improve global component polish: floating WhatsApp pulse, elegant active navigation, richer filters/selectors, section dividers, and responsive mobile touch feedback.

## Boundaries

No external email, CRM, analytics, social, or payment automation is added. The newsletter remains an honest unconnected form. Existing price-on-request copy, approved WhatsApp number, static product pages, and product sharing metadata stay intact. All visuals use current local assets and CSS/vanilla JavaScript.

## Architecture and verification

`assets/css/styles.css` owns tokens, keyframes, responsive styling, and reduced-motion overrides. `assets/js/main.js` owns opt-in browser interactions, page transition lifecycle, scroll progress, recently viewed storage, and inspiration rail behavior. Markup gains semantic data hooks and accessible controls only where needed.

Tests will first verify the new hooks and pure local-storage/product-state behavior. Interaction tests will use the existing lightweight document harness for pause/control behavior, and the full Node suite plus JavaScript syntax and static route checks will protect the finished site.
