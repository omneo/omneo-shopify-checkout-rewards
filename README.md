# Shopify Checkout Test
A small test repo for performance of the Shopify Checkout balance check. This component uses `Preact` for dom manipulation and `Unfetch` to polyfill modern `fetch` functionality.

### Dependencies
* `Preact` for dom manipulation and tiny code footprint
* `Unfetch` for HTTP requests, based on fetch() spec
* `Webpack 4` for code bundling and minification

### Getting started

Add auth details to `omneoShopify.build()` in body of  `/src/index.html`

```
yarn install
yarn watch
```
Open `/dist/index.html` and you're good to go.

### Production build
```
yarn build
```