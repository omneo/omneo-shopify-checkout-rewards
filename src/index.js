import preact from 'preact';
import App from './containers/App';
import ready from 'document-ready-promise';

const build = (environment) => {
    window.OmneoShopifyCheckoutRewards_config = environment;
    if(!environment.omneoUrl || !environment.shopifyProfileId || !environment.rewardVariantId){return;}
    if(!window.Shopify || !window.Shopify.Checkout || !window.Shopify.Checkout.step){return}

    ready().then(()=>{
        const summarySections = document.getElementsByClassName('order-summary__sections');
        if(!summarySections[0]){return;}
        const Component = document.createElement("div");
        Component.id = 'omneo-shopify-checkout-rewards';
        Component.className = "order-summary__section";
        Component.style = "border-bottom: 1px solid rgba(175,175,175,0.34)";
        summarySections[0].insertBefore(Component, summarySections[0].children[1]);

        preact.render(<App environment={environment}/>, Component);
    })
};

window.OmneoShopifyCheckoutRewards = {build};