import preact from 'preact';
import request from '../services/request';

import RewardField from '../components/RewardField';

export default class extends preact.Component {
    constructor() {
        super();
        const environment = Object.assign({}, window.OmneoShopifyCheckoutRewards_config)

        this.state = {
            init: false,
            balances: false,
            environment: environment,
            rewardApplied: this.isRewardApplied(environment)
        };
        delete window.OmneoShopifyCheckoutRewards_config;
        this.requestBalance();
    }

    isRewardApplied(environment){
        const products = document.getElementsByClassName('product');
        for(let index in products){
            const product = products[index];
            if(product && product.dataset && product.dataset.variantId && product.dataset.variantId == environment.lineItemId){
                product.style = "display:none !important";
                return {
                    index: parseInt(index)+1, // Because Shopify uses n+1 line numbers
                    product
                }
            }
        }
        return false
    }

    requestBalance() {
        const {environment} = this.state;
        request.call({
            url: environment.url+'/v3/profiles/'+environment.profileId+'/balances',
            method: 'GET',
            token: environment.token
        }).then(response=> {
            this.setState({
                init: true,
                balances: response.data
            })
        }).catch(error=> {
            this.setState({
                init: true,
                balances: false
            })
        })
    }

    render(props, state) {
        const {init, balances, environment, rewardApplied} = state;
        if(!init){
            return <h4>Fetching rewards</h4>
        }
        if(!balances){
            return <h4 style={{color:'red'}}>Error getting balance</h4>
        }
        return (
            <RewardField balance={balances.combined_balance_dollars || 0} environment={environment} rewardApplied={rewardApplied}/>
        )
    }
}