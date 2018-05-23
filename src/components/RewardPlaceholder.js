import preact from 'preact';
export default class extends preact.Component {
    render() {
        return (
            <div className="fieldset">
                <div className="field field--show-floating-label">
                    <h3 style="margin-bottom: 20px;">Loyalty rewards</h3>
                    <div className="field__input-btn-wrapper">
                        <div className="field__input-wrapper">
                            <label className="field__label field__label--visible" htmlFor="checkout_reduction_code">Rewards</label>
                            <input
                                placeholder="Available rewards ($)"
                                className="field__input"
                                size="30"
                                type="text"
                                value=""
                                id="balance"
                                disabled={true}
                                style="opacity:0.5"
                            />
                        </div>
                        <button
                            type="submit"
                            className="field__input-btn btn btn--disabled"
                            style="background-color:#c8c8c8 !important"
                            disabled={true}>
                            <span className="btn__content visually-hidden-on-mobile">Apply</span>
                            <i className="btn__content shown-on-mobile icon icon--arrow" />
                            <i className="btn__spinner icon icon--button-spinner" />
                        </button>
                    </div>
                    <small style="margin-top: 10px;display:block;line-height:1;">Rewards are not redeemable against gift cards or shipping</small>
                </div>
            </div>
        )
    }
}