# Shopify Checkout Reward Component
A small package for checking and applying an Omneo reward balance to Shopify Checkout. This component uses `Preact` for dom manipulation and `Unfetch` to polyfill modern `fetch` functionality.

## Shopify install
Add a new product to Shopify with the description of `Loyalty Reward` or eqivalent and copy the variant ID. [Finding your Variant ID](https://help.shopify.com/themes/customization/products/variants/find-variant-id)

Add the Omneo Rewards scripts to your `checkout.liquid` file. These should include the minified production code, from CDN and an init script. Ensure that the following parameters are added correctly:

`url` Your Omneo or Omneo Proxy URL
`token` Your Omneo or Omneo Proxy authentication token
`lineItemId` The Product Variant ID for the reward product created earlier
 
```
<script type="text/javascript" src="{add cdn link here}"></script>
<script>
    OmneoShopifyCheckoutRewards.build({
      url: {omneoProxyURL},
      token: {omneoProxyToken},
      lineItemId: {Reward }
    })
  </script>
```

Once the script is correctly installed and configured, the checkout experience will need the appropriate Shopify Scripts added. Also, the `Loyalty Reward` product will need to be hidden on collection and cart pages. This library will ensure it's hidden on the checkout page.


## DEVELOPMENT
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