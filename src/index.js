import preact from 'preact';
import App from './containers/App';

const build = (environment) => {
    window.omneoEnvironment = environment;
    if(
        !environment.elementId ||
        !environment.url ||
        !environment.token ||
        !environment.profileId
    ){return;}
    preact.render(<App/>, document.getElementById(environment.elementId));
};

window.omneoShopify = {
    build
};