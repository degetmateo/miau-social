import Helper from "../../Helper.js";

Helper.ImportCSS('/public/components/captcha-badge/captcha-badge.css');

export default class CaptchaBadge {
    constructor () {
        this.badge = document.createElement('div');
        this.badge.classList.add('captcha-badge');

        this.img = document.createElement('img');
        this.img.src = 'https://www.gstatic.com/recaptcha/api2/logo_48.png';
        this.img.alt = 'ReCAPTCHA Badge';
        this.img.classList.add('captcha-badge-img');
        this.badge.append(this.img);

        this.info = document.createElement('div');
        this.info.classList.add('captcha-badge-info');
        this.badge.append(this.info);

        this.text = document.createElement('span');
        this.text.textContent = 'Protegido por reCAPTCHA';
        this.text.classList.add('captcha-badge-text');
        this.info.append(this.text);

        this.terms = document.createElement('div');
        this.terms.classList.add('captcha-badge-terms');
        this.info.append(this.terms);

        this.privacy = document.createElement('a');
        this.privacy.textContent = 'Privacidad';
        this.privacy.href = 'https://www.google.com/intl/es-419/policies/privacy/';
        this.privacy.target = '_blank';
        this.privacy.classList.add('link');
        this.terms.append(this.privacy);

        this.terms.append(document.createTextNode('-'));

        this.conds = document.createElement('a');
        this.conds.textContent = 'Condiciones';
        this.conds.href = 'https://www.google.com/intl/es-419/policies/terms/';
        this.conds.target = '_blank';
        this.conds.classList.add('link');
        this.terms.append(this.conds);
    }

    render () {
        return this.badge;
    }
}