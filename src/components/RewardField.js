import preact from 'preact';
export default class extends preact.Component {
    constructor(props) {
        super(props);
        const {environment} = this.props;

        this.state = {
            redeem: environment.rewardApplied !== false ? environment.rewardApplied : this.getMax(),
            loading: false
        };

        this.onChange = this.onChange.bind(this);
        this.applyRewards = this.applyRewards.bind(this);
        this.removeRewards = this.removeRewards.bind(this);
    }

    checkCartCanUseReward(){
        // const isRewardApplied = this.isRewardApplied();
        // if(!isRewardApplied){return}

        // const max = this.getMax();
        // const {redeem} = this.state;

        // if(max <= 0 || parseFloat(redeem) > parseFloat(max)){
        //     this.removeRewards();
        // }
    }

    componentDidMount(){
        this.checkCartCanUseReward();
    }

    getMax(){
        const {environment, maxBalance} = this.props;
        const {subTotal} = environment;
        if(subTotal === null){return maxBalance}
        let subTotalValue = parseInt(subTotal) / 100;

        return subTotalValue < maxBalance ? subTotalValue : maxBalance;
    }

    validate(string){
        var pattern = new RegExp(/^[0-9]+\.?[0-9]{0,2}$/);
        return pattern.test(string);
    }

    onChange(e){
        if(e.key && e.key === "Enter"){return}
        e.preventDefault();

        let value = e.target.value;
        if(e.key){
            value = e.target.value+e.key;
        }

        if(value !== ''){
            if(!this.validate(value)){return;}
            if(parseFloat(value) > this.getMax()){
                this.setState({redeem: this.getMax()});
                return;
            }
        }

        this.setState({
            redeem: value
        })
    }

    applyRewards(e){
        if(e){e.preventDefault()}
        const {environment} = this.props;
        const {redeem} = this.state;
        const {rewardVariantId} = environment;
        this.setState({
            loading: true
        });

        fetch('/cart/add.js',{
            method:"POST",
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                quantity: 1,
                id: rewardVariantId,
                properties: {
                    amount: redeem
                }
            })
        }).then(function(response){
            if(response.ok){ location.reload();}
        });
    }

    removeRewards(e){
        if(e){e.preventDefault()}
        const {rewardVariantId} = this.props.environment;
        this.setState({
            loading: true
        });
        fetch('/cart/update.js',{
            method:"POST",
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                updates: {
                    [rewardVariantId]: 0
                }
            })
        }).then(function(response){
            if(response.ok){ location.reload();}
        });
    }

    buttonClasses(){
        const {maxBalance} = this.props;
        const {redeem, loading} = this.state;
        let classes = ["field__input-btn","btn"];
        if(!redeem || redeem == 0 || redeem === '' || maxBalance == 0){classes.push("btn--disabled")}
        if(loading){classes.push("btn--loading")}
        return classes.join(' ');
    }

    isRewardApplied(){
        return this.props.environment.rewardApplied !== false;
    }

    getMaxDisplay(isRewardApplied){
        const {maxBalance} = this.props;
        const {redeem} = this.state;

        if(isRewardApplied){
            return [
                <span key="max" style={{textDecoration:'line-through', opacity: .5, marginRight: '5px'}}>${maxBalance}</span>,
                <span key="redeem">${(parseFloat(maxBalance) - parseFloat(redeem)).toFixed(2)} (after checkout)</span>
            ]
        }
        return '$'+maxBalance
    }

    getSvg(){
        var useTag = '<use xlink:href="/svg/svg-sprite#my-icon" />';
        return <svg dangerouslySetInnerHTML={{__html: useTag }} />;
    }

    render(props, state) {
        const {maxBalance, environment, title} = props;
        const {redeem, loading} = state;
        const buttonDisabled = loading || redeem === '' || redeem == 0 || maxBalance <= 0;

        if(environment.hideIfInactive && maxBalance <= 0){
            return null
        }

        const isRewardApplied = this.isRewardApplied();

        return (
            <div className="fieldset">
                <form onSubmit={isRewardApplied ? this.removeRewards : this.applyRewards}>
                    <div className="field field--show-floating-label">
                        <h3 style="margin-bottom: 20px;">{title} {this.getMaxDisplay(isRewardApplied)}</h3>
                        <div className="field__input-btn-wrapper">
                            <div className="field__input-wrapper">
                                <label className="field__label field__label--visible" htmlFor="checkout_reduction_code">{isRewardApplied ? "Rewards applied" : "Apply reward value"} ($)</label>
                                <input
                                    placeholder="0"
                                    className="field__input"
                                    size="30"
                                    type="text"
                                    value={redeem}
                                    id="redeem"
                                    disabled={loading || isRewardApplied}
                                    onKeyPress={this.onChange}
                                    onInput={this.onChange}
                                    style={isRewardApplied?'opacity:0.5':''}
                                />
                            </div>
                            <button
                                type="submit"
                                onClick={isRewardApplied ? this.removeRewards : this.applyRewards}
                                className={this.buttonClasses()}
                                style={buttonDisabled ? "background-color:#c8c8c8 !important":""}
                                disabled={buttonDisabled}
                                aria-busy={loading}
                            >
                                <span className="btn__content visually-hidden-on-mobile">{isRewardApplied ? "Remove" : "Apply"}</span>
                                
                                {
                                    isRewardApplied ? (
                                        <svg 
                                            class="icon-svg icon-svg--size-16 btn__icon shown-on-mobile" 
                                            aria-hidden={loading} 
                                            focusable="false"
                                            dangerouslySetInnerHTML={{__html:'<use xlink:href="#close" />'}}
                                        />
                                    ):(
                                        <svg 
                                            class="icon-svg icon-svg--size-16 btn__icon shown-on-mobile" 
                                            aria-hidden={loading} 
                                            focusable="false"
                                            dangerouslySetInnerHTML={{__html:'<use xlink:href="#arrow" />'}}
                                        />
                                    )
                                }
                                <svg 
                                    class="icon-svg icon-svg--size-18 btn__spinner icon-svg--spinner-button" 
                                    aria-hidden={!loading} 
                                    focusable="false" 
                                    dangerouslySetInnerHTML={{__html:'<use xlink:href="#spinner-button" />'}}
                                />
                            </button>
                        </div>
                        <small style="margin-top: 10px;display:block;line-height:1;">Rewards are not redeemable against gift cards or shipping</small>
                    </div>
                </form>
            </div>
        )
    }
}