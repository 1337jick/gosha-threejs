import { dispatch } from 'Models/utils/event-bus';

export default function loadGoogleRecaptcha() {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://www.google.com/recaptcha/api.js?onload=recaptchaLoaded&render=explicit';
    document.getElementsByTagName('head')[0].appendChild(script);
}

window.recaptchaLoaded = function () {
    dispatch('recaptcha-ready');
};
