# Shopify Checkout Reward Component
A small package for checking and applying an Omneo reward balance to Shopify Checkout. This component uses `Preact` for dom manipulation and `Unfetch` to polyfill modern `fetch` functionality.

## Shopify install
Installing this component includes a number of quick steps:

### Add Loyalty Reward product
Add a new product to Shopify with the description of `Loyalty Reward` or eqivalent and copy the variant ID. [Finding your Variant ID](https://help.shopify.com/themes/customization/products/variants/find-variant-id)

This is used by the checkout script and component to apply dynamic rewards to a transaction.

### Create component snippet
Create a new snippet in your Shopify theme called `omneo-checkout-rewards.liquid` and copy the following code into the start of the file. Add your Omneo url, token, profile id and the Shopify Variant ID of your Loyalty Reward product.
```
{% assign omneoUrl = '' %}
{% assign omneoToken = '' %}
```
Once the variables are added, add the following code to complete the snippet:
```
{% assign rewardApplied = false %}
{% for line_item in checkout.line_items %}
  	{% if line_item.variant_id == rewardVariantId %}
		{% for property in line_item.properties %}
			{% if property[0] == 'amount' %}
				{% assign rewardApplied = property[1] %}
			{% endif %}
		{% endfor %}
    {% endif %}
{% endfor %}
{% assign omneoToken = false %}
{% assign omneoProfileId = false %}
{% if customer != blank %}
	{% if customer.metafields.omneo != blank %}
		{% assign omneoToken = customer.metafields.omneo.token %}
		{% assign omneoProfileId = customer.id %}
	{% endif %}
{% endif %}
<style>
  .product[data-variant-id="{{rewardVariantId}}"]{display:none}
  .product[data-variant-id="{{rewardVariantId}}"]:first-child + tr .product__description{padding-top:0;}
  .product[data-variant-id="{{rewardVariantId}}"]:first-child + tr .product__image{padding-top:0;}
</style>
<script type="text/javascript" src="//cdn.omneo.io/omneo-shopify-checkout-rewards.js"></script>
<script>
	OmneoShopifyCheckoutRewards.build({
      omneoUrl: '{{omneoUrl}}',
      omneoToken: '{{omneoToken}}',
      omneoProfileId: '{{omneoProfileId}}',
      rewardVariantId: {{rewardVariantId}},
      subTotal: {{ checkout.subtotal_price}},
      rewardApplied: {{rewardApplied}}
    })    
</script>
```

### Update checkout.liquid
Include the following code immediately before the head closing tag `</head>` in `checkout.liquid`:
```
{% include 'omneo-checkout-rewards' %}
```

### Add Omneo Token page template
Create a page template named page.omneoViewToken.liquid and add the following code:
```
<div style="display:none">
{% if customer.metafields.omneo != blank %}
	{% if customer.metafields.omneo.token != blank %}
  		<TOKEN>{{customer.metafields.omneo.token}}<TOKEN>
	{% endif %}
{% endif %}
</div>
```

### Create the token page
Make a new page in Shopify with the url `/pages/omneoviewtoken` and publish this page. This page should not be indexed or linked to from any other area.

### Add Shopify Script
If you haven't already installed the Shopify Scripts app, follow the instructions here: [Script Editor](https://apps.shopify.com/script-editor)

Navigate to the Shopify Scripts app and create a new `Line Items` script with a blank template. Copy the following script and ensure the reward variable id is updated to reflect your own Loyalty Reward product:

```
LOYALTY_ITEM_VARIATION_ID = 7289148866595;

def get_applied_loyalty_rewards(line_items)
 reward_amount = 0;

 if line_items.kind_of?(Array)
   line_items.each do |line_item|
     if line_item.variant.id == LOYALTY_ITEM_VARIATION_ID
       next unless line_item.properties['amount']
       reward_amount += Integer(line_item.properties['amount']*100)
     end
   end
 end

 reward_amount
end

def apply_loyalty_rewards(line_items)
 reward_amount = get_applied_loyalty_rewards(line_items)
 reward_remainder = 0.0
 total_reward_elegible_price = Integer(Input.cart.subtotal_price.cents.to_s)

 if line_items.kind_of?(Array)
   line_items.each do |line_item|
      price = Integer(line_item.line_price.cents.to_s)
      if price > 0
       proportion =  price / total_reward_elegible_price
       discount_float = (reward_amount * proportion) + reward_remainder
       discount = discount_float.round
       reward_remainder =  discount_float - discount
       line_item.change_line_price(line_item.line_price - Money.new(cents: discount), message: 'Loyalty Rewards')
      end
   end
 end
end

apply_loyalty_rewards(Input.cart.line_items)

Output.cart = Input.cart
```

### Hide the Loyalty Reward product from public and go live
You're (almost) all done! Loyalty rewards should now be active and ready for customers to checkout. Just ensure that the the Loyalty Reward placeholder product is not visible in any collections or publicly facing product views.

## DEVELOPMENT
### Dependencies
* `Preact` for dom manipulation and tiny code footprint
* `Unfetch` for HTTP requests, based on fetch() spec
* `Webpack 4` for code bundling and minification

### Getting started
```
yarn install
yarn watch
```
This component requires a Shopify Checkout environment and liquid code to function correctly. Local development should be completed using ThemeKit or by including the local main.js file in a development theme, through port forwarding such as NGROK etc.



