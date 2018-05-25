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
        const {omneoUrl, omneoToken, omneoProfileId} = environment;
        if(omneoToken){
            this.requestBalance(omneoToken);
        }else{
            this.refreshToken(omneoProfileId).then(response=>{
                this.requestBalance(response.data.token);
            });
        }
    }

    refreshToken(){
        const {environment} = this.state;
        const {omneoUrl, omneoProfileId} = environment;
        return request.refreshToken({
            url: omneoUrl+'/auth/token',
            id: omneoProfileId
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
            url: omneoUrl+'/proxy/balances',
            method: 'GET',
            token: token
        }).then(response=> {
           console.log("success", response);
            this.setState({
                init: true,
                balances: response.data
            })
        }).catch(error=> {
           error.then(error=>{
               console.log("Attempt refresh", error);
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