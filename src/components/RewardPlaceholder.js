import preact from 'preact';
import Spinner from './Spinner';
export default class extends preact.Component {
    render() {
        const {loadingMessage, errorMessage, supportEmail, hideIfInactive, title} = this.props;
        if(errorMessage){
            if(hideIfInactive){return null}

            return(
                <div className="fieldset">
                    <div className="field field--show-floating-label">
                        <p>{errorMessage}</p>
                        {supportEmail ? <a href={`mailto:${supportEmail}`} style="margin-top: 10px;display:block">{environment.supportEmail}</a> : null}
                    </div>
                </div>
            )   
        }

        return (
            <div className="fieldset">
                <div className="field field--show-floating-label">
                    <h3 style="margin-bottom: 20px;">{title}</h3>
                    <div className="field__input-btn-wrapper">
                        <div className="field__input-wrapper">
                            <Spinner/>
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
                    {loadingMessage ? <p style="margin-top: 10px;display:block">{loadingMessage}</p> : <small style="margin-top: 10px;display:block;line-height:1;">Rewards are not redeemable against gift cards or shipping</small>}
                </div>
            </div>
        )
    }
}