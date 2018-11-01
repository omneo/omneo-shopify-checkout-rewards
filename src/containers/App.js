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
        this.handleRequest();
    }

    handleRequest(){
        const {environment} = this.state;
        const {omneoUrl, omneoToken, shopifyProfileId} = environment;
        if(omneoToken){
            this.requestBalance(omneoToken);
        }else{
            this.refreshToken(shopifyProfileId).then(response=>{
                this.requestBalance(response.data.token);
            });
        }
    }

    refreshToken(){
        const {environment} = this.state;
        const {omneoUrl, shopifyProfileId} = environment;
        return request.refreshToken({
            url: omneoUrl+'/auth/token',
            id: shopifyProfileId
        }).then(response=>{
            return response.data && response.data.token ? response.data.token : false;
        }).catch(error=>{
            return false;
        });
    }

    requestBalance(token, attempt = false) {
        const {environment} = this.state;
        const {omneoUrl} = environment;
       request.call({
            url: omneoUrl+'/proxy/me/balances',
            method: 'GET',
            token: token
        }).then(response=> {
            this.setState({
                init: true,
                balances: response.data
            })
        }).catch(error=> {
           error.then(error=>{
               if(!attempt && error.response.status === 401){
                   this.refreshToken().then(token=>{
                       if(token){
                           this.requestBalance(token,true);
                       }
                   })
               }
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