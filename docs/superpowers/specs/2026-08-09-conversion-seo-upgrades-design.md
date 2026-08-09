# Elegance Africa conversion and sharing upgrades

## Scope

Add a client-side three-question **Find Your Signature** quiz to the existing homepage. It asks for hair texture, occasion, and style preference, then maps the selected answers to one of the existing six product IDs. The result presents the recommended piece with a direct product-page link. No backend or tracking service is required.

On the reusable product page, add optional length and density selectors. The visitor's selections update the WhatsApp enquiry link so the team receives the product name plus the chosen length and density. The product view also renders a product-specific **Wear it how** note from the catalogue data.

Add a small local favicon derived from the existing logo, common Open Graph and Twitter metadata, and dynamic product-specific metadata and JSON-LD Product/Organization markup when a valid product is open. Price and availability remain intentionally non-specific because the business has not supplied fixed values.

Add a branded `404.html` page that returns visitors to the shop or WhatsApp. Improve initial rendering by preloading the existing hero image rather than attempting unsupported lazy loading of a CSS background image.

## Newsletter boundary

The newsletter remains an honest static form: it validates an email address, acknowledges the visitor's interest, and explicitly says that delivery is not connected yet. No external mailing-list endpoint is invented or implied.

## Data and interaction boundaries

`assets/js/products.js` remains the source of truth for product descriptions, styling notes, images, and selectable length/density options. `assets/js/main.js` owns quiz flow, product-view rendering, selector event handling, metadata injection, and newsletter messaging. Static markup retains meaningful no-JavaScript content where practical.

## Verification

Automated Node tests will first assert the new catalogue data, quiz/result hooks, selector hooks, metadata hooks, and branded 404 page. Tests will cover WhatsApp URL composition with options and verify all existing checks remain green. JavaScript syntax checks and local route smoke checks will run after implementation.
