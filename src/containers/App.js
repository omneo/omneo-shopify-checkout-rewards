import preact from 'preact';
import request from '../services/request';

import RewardPlaceholder from '../components/RewardPlaceholder';
import RewardField from '../components/RewardField';
import RewardError from '../components/RewardError';

export default class extends preact.Component {
    constructor(props) {
        super(props);
        this.state = {
            init: false,
            attempts: 0,
            balances: false
        };
    }

    expandContainer(){
        const {autoExpandSummary} = this.props.environment;
        if(!autoExpandSummary){return}

        // Expand summary view on mobile, if closed
        var summaryButton = document.querySelector('[data-trekkie-id="order_summary_toggle"]');
        var isExpanded = summaryButton.getAttribute("aria-expanded");
        if(isExpanded === 'false'){
            summaryButton.click();	
        }
    }

    componentDidMount(){
        this.handleRequest();
        this.expandContainer();
    }

    handleRequest(){
        const {omneoToken} = this.props.environment;
        if(omneoToken){
            this.requestBalance(omneoToken);
        }else{
            this.refreshToken()
        }
    }

    retry(attempt){
        console.log('Reward attempt', attempt);
        if(attempt < 5){
            setTimeout(()=>{
                this.setState({attempts: attempt});
                this.refreshToken(attempt);
            }, 5000)
        }
    }

    refreshToken(attempt = 0){
        const {environment} = this.props;
        const {omneoUrl, shopifyProfileId} = environment;
        return request.refreshToken({
            url: omneoUrl+'/auth/token',
            id: shopifyProfileId
        }).then(response=>{
            
            const token =  response.data && response.data.token ? response.data.token : false;
            if(token){
                // console.log('Refresh success', token);
                this.requestBalance(token, attempt);
                return token;
            }
            
            this.retry(attempt+1);
        }).catch(error=>{
            // console.log('Refresh error', error);
            this.retry(attempt+1);
        });
    }

    requestBalance(token, attempt = 4) {  
        const {omneoUrl} = this.props.environment;
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
            // console.log('Balance error', attempt);
            if(attempt < 5){
                this.refreshToken(5)
            }
        })
    }

    render() {
        const {init, balances, attempts} = this.state;
        const {environment} = this.props;
        const {
            hideIfInactive,
            supportEmail,
            title = 'Loyalty rewards available:',
            errorMessage = "There was an issue retrieving your reward balance. Please try again shortly or get in touch with customer support.", 
            loadingMessage = "Just a moment as we set up your account"
        } = environment;
        
        if(!init){
            return(
                <RewardPlaceholder
                    loadingMessage={attempts > 0 ? loadingMessage : false} 
                    errorMessage={attempts >= 5 ? errorMessage : false}
                    supportEmail={supportEmail}
                    title={title}
                    hideIfInactive={hideIfInactive}
                />
            )
        }
        if(!balances){
            return(
                <RewardPlaceholder
                    errorMessage={errorMessage}
                    supportEmail={supportEmail}
                    title={title}
                    hideIfInactive={hideIfInactive}
                />
            )
        }
        return(
            <RewardField
                maxBalance={balances.combined_balance_dollars || 0}
                environment={environment}
                title={title}
            />
        )
    }
}