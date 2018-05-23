import preact from 'preact';
import request from '../services/request';

import RewardPlaceholder from '../components/RewardPlaceholder';
import RewardField from '../components/RewardField';
import RewardError from '../components/RewardError';

export default class extends preact.Component {
    constructor() {
        super();
        const environment = Object.assign({}, window.OmneoShopifyCheckoutRewards_config);
        delete window.OmneoShopifyCheckoutRewards_config;
        this.state = {
            init: false,
            balances: false,
            environment: environment
        };
        this.requestBalance();
    }

    requestBalance() {
        const {environment} = this.state;
        request.call({
            url: environment.omneoUrl+'/v3/profiles/'+environment.omneoProfileId+'/balances',
            method: 'GET',
            token: environment.omneoToken
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
        const {init, balances, environment} = state;
        if(!init){
            return <RewardPlaceholder/>
        }
        if(!balances){
            return <RewardError/>
        }
        return(
            <RewardField
                maxBalance={balances.combined_balance_dollars || 0}
                environment={environment}
            />
        )
    }
}