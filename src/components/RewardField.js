import preact from 'preact';
export default class extends preact.Component {
    constructor(props) {
        super(props);
        this.state = {
            maxBalance: this.props.balance,
            balance: this.props.balance,
            loading: false
        };

        this.onChange = this.onChange.bind(this);
        this.applyRewards = this.applyRewards.bind(this);
        this.removeRewards = this.removeRewards.bind(this);
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
            if(parseFloat(value) > this.state.maxBalance){
                this.setState({balance: this.state.maxBalance});
                return;
            }
        }

        this.setState({
            balance: value
        })
    }

    createIframe(url){
        this.setState({loading:true});
        let cartWindow = document.createElement("iframe");
        cartWindow.src = url;
        cartWindow.style = "display:none";
        document.body.appendChild(cartWindow);
        cartWindow.contentDocument.close();
        document.body.removeChild(cartWindow);
        setTimeout(()=>{
            location.reload();
        },100)
    }

    applyRewards(e){
        if(e){e.preventDefault()}

        const {environment, balance} = this.props;
        const {lineItemId} = environment;

        // TODO add signature
        let properties = {
            id: lineItemId,
            quantity: 1,
            "properties[value]":balance,
            "properties[signature]":"lskdhfksljdhf"
        };
        let queryString = Object.keys(properties).map(key=>key+'='+properties[key]).join('&');
        this.createIframe("/cart/add?"+queryString)
    }

    removeRewards(e){
        if(e){e.preventDefault()}
        const {rewardApplied} = this.props;
        this.createIframe("/cart/change?line="+rewardApplied.index+"&quantity=0")
    }

    buttonClasses(){
        const {balance, loading} = this.state;
        let classes = ["field__input-btn","btn"];
        if(!balance || balance === '0' || balance === ''){classes.push("btn--disabled")}
        if(loading){classes.push("btn--loading")}
        return classes.join(' ');
    }

    render(props, state) {
        const {rewardApplied} = props;
        const {balance, loading} = state;
        const buttonDisabled = loading || balance === '' || balance === '0';
        return (
            <div className="fieldset">
                <form onSubmit={rewardApplied ? this.removeRewards : this.applyRewards}>
                    <div className="field field--show-floating-label">
                        <div className="field__input-btn-wrapper">
                            <div className="field__input-wrapper">
                                <label className="field__label field__label--visible" htmlFor="checkout_reduction_code">{rewardApplied ? "Applied" : "Available"} rewards ($)</label>
                                <input
                                    placeholder={rewardApplied ? "Applied rewards ($)" : "Available rewards ($)"}
                                    className="field__input"
                                    size="30"
                                    type="text"
                                    value={balance}
                                    id="balance"
                                    disabled={loading || rewardApplied}
                                    onKeyPress={this.onChange}
                                    onInput={this.onChange}
                                    style={rewardApplied?'opacity:0.5':''}
                                />
                            </div>
                            <button
                                type="submit"
                                onClick={rewardApplied ? this.removeRewards : this.applyRewards}
                                className={this.buttonClasses()}
                                style={buttonDisabled ? "background-color:#c8c8c8 !important":""}
                                disabled={buttonDisabled}>
                                <span className="btn__content visually-hidden-on-mobile">{rewardApplied ? "Remove" : "Apply"}</span>
                                <i className="btn__content shown-on-mobile icon icon--arrow" />
                                <i className="btn__spinner icon icon--button-spinner" />
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}