import preact from 'preact';
import omneo from '../services/omneo';

export default class extends preact.Component {
    constructor() {
        super();
        this.state = {
            init: false,
            balances: false
        };
        this.requestBalance();
    }

    requestBalance() {
        omneo.call({
            url: '/v3/profiles/'+window.omneoEnvironment.profileId+'/balances',
            method: 'GET'
        }).then(response=> {
            console.log('Balance: SUCCESS',response);
            this.setState({
                init: true,
                balances: response.data
            })
        }).catch(error=> {
            console.log('Balance: ERROR',error);
            this.setState({
                init: true,
                balances: false
            })
        })
    }

    render(props, state) {
        const {init, balances} = state;
        if(!init){
            return <h4>Loading...</h4>
        }
        if(!balances){
            return <h4 style={{color:'red'}}>Error getting balance</h4>
        }
        return (
            <h4>${balances.combined_balance_dollars ? balances.combined_balance_dollars : '0'}</h4>
        )
    }
}