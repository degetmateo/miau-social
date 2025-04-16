import {importCSS} from "../../helpers.js";
import router from "../../router.js";
import {authenticationService} from "../../services/authenticationService.js";
import Validator from "../../Validator.js";
import Alert from "../alert/alert.js";
import CaptchaBadge from "../captcha-badge/CaptchaBadge.js";
import Input from "../input/input.js";
import ScreenSpinner from "../screen-spinner/ScreenSpinner.js";

importCSS('/public/components/form-signup/form-signup.css');

export default class FormSignup {
    constructor (data = {
        onSubmit: null
    }) {
        this.form = document.createElement('form');
        this.form.classList.add('form-signup');

        this.titleContainer = document.createElement('div');
        this.titleContainer.classList.add('form-signup-title-container');
        // this.form.append(this.titleContainer);

        this.title = document.createElement('span');
        this.title.textContent = 'Hola, acá podés crear tu cuenta.';
        this.titleContainer.append(this.title);

        // this.subtitleContainer = document.createElement('div');
        // this.subtitleContainer.classList.add('form-signup-subtitle-container');
        // this.titleContainer.append(this.subtitleContainer);

        // this.subtitle = document.createElement('span');
        // this.subtitle.textContent = '¿Ya tenés una?';
        // this.subtitle.classList.add('form-signup__subtitle');
        // this.subtitleContainer.append(this.subtitle);

        // this.subtitleLink = document.createElement('a');
        // this.subtitleLink.textContent = 'Ingresá acá.';
        // this.subtitleLink.classList.add('form-signup__subtitle-link', 'link');
        // this.subtitleLink.onclick = (e) => {
        //     e.preventDefault();
        //     router.navigateTo('/signin');
        // }
        // this.subtitleContainer.append(this.subtitleLink);

        this.nameContainer = document.createElement('div');
        this.nameContainer.classList.add('form-signup-label-container');
        // this.form.append(this.nameContainer);

        this.name = new Input({
            min: 0,
            max: 32,
            onStop: null,
            title: '¿Cómo querés que te digan?',
            type: 'text',
            autocomplete: 'name'
        });
        this.nameContainer.append(this.name.render());

        this.nameDetails = document.createElement('span');
        this.nameDetails.textContent = 'No tiene por qué ser tu nombre real.';
        this.nameDetails.classList.add('form-signup__details');
        this.nameContainer.append(this.nameDetails);

        this.usernameContainer = document.createElement('div');
        this.usernameContainer.classList.add('form-signup-label-container');
        // this.form.append(this.usernameContainer);

        this.username = new Input({
            min: 0,
            max: 16,
            onStop: null,
            title: 'Necesitás un nombre de usuario.',
            type: 'text',
        });
        this.usernameContainer.append(this.username.render());

        this.usernameDetails = document.createElement('span');
        this.usernameDetails.textContent = 'Debe ser único. Solo letras, números y guiones bajos.';
        this.usernameDetails.classList.add('form-signup__details');
        this.usernameContainer.append(this.usernameDetails);

        this.emailContainer = document.createElement('div');
        this.emailContainer.classList.add('form-signup-label-container');
        // this.form.append(this.emailContainer);

        this.email = new Input({
            min: 0,
            max: 64,
            onStop: null,
            title: 'Necesitamos tu correo electrónico.',
            type: 'text'
        });
        this.email.input.autocomplete = 'email';
        this.emailContainer.append(this.email.render());

        this.emailDetails = document.createElement('span');
        this.emailDetails.textContent = 'Será una capa de seguridad extra.';
        this.emailDetails.classList.add('form-signup__details');
        this.emailContainer.append(this.emailDetails);

        this.passwordContainer = document.createElement('div');
        this.passwordContainer.classList.add('form-signup-label-container');
        // this.form.append(this.passwordContainer);

        this.password = new Input({
            min: 8,
            max: 128,
            onStop: null,
            title: 'Necesitás una clave.',
            type: 'password'
        });
        this.password.input.autocomplete = 'new-password';
        this.passwordContainer.append(this.password.render());

        this.passwordDetails = document.createElement('span');
        this.passwordDetails.textContent = 'No escribas 123, ¿dale? Como mínimo, 8 carácteres.';
        this.passwordDetails.classList.add('form-signup__details');
        this.passwordContainer.append(this.passwordDetails);

        this.passwordConfirmationContainer = document.createElement('div');
        this.passwordConfirmationContainer.classList.add('form-signup-label-container');
        // this.form.append(this.passwordConfirmationContainer);

        this.passwordConfirmation = new Input({
            min: 8,
            max: 128,
            onStop: null,
            title: 'Repetí la clave, por las dudas.',
            type: 'password'
        });
        this.passwordConfirmation.input.autocomplete = 'new-password';
        this.passwordConfirmationContainer.append(this.passwordConfirmation.render());

        this.passwordConfirmationDetails = document.createElement('span');
        this.passwordConfirmationDetails.textContent = 'Es una forma de asegurar que no te equivocaste.';
        this.passwordConfirmationDetails.classList.add('form-signup__details');
        this.passwordConfirmationContainer.append(this.passwordConfirmationDetails);

        this.buttonContainer = document.createElement('div');
        this.buttonContainer.classList.add('form-signup-button-container--single');
        // this.form.append(this.buttonContainer);

        this.backButton = document.createElement('button');
        this.backButton.classList.add('signup-button');
        this.backButton.textContent = '← Volver';
        this.backButton.onclick = (e) => {
            e.preventDefault();
            this.back();
        }

        this.nextButton = document.createElement('button');
        this.nextButton.classList.add('signup-button');
        this.nextButton.textContent = 'Continuar →';
        this.nextButton.onclick = (e) => {
            e.preventDefault();
            this.next();
        }

        // this.buttonContainer.append(this.button);

        this.cooldown = false;
        this.stage = 'initial';
        this.stages = ['initial', 'email', 'username', 'name', 'password', 'confirmation', 'verify'];
        this.resolve();
    }

    resolve () {
        switch (this.stage) {
            case 'initial':
                this.onInitial();
                break;
            case 'email':
                this.onEmail();
                break;
            case 'username':
                this.onUsername();
                break;
            case 'name':
                this.onName();
                break;
            case 'password':
                this.onPassword();
                break;
            case 'confirmation':
                this.onConfirmation();
                break;
            case 'verify':
                this.onVerify();
                break;
            default:
                this.onInitial();
                break;
        }
    }

    onInitial () {
        this.stage = 'initial';
        this.form.innerHTML = '';
        this.form.append(this.titleContainer);

        this.buttonContainer.innerHTML = '';
        this.buttonContainer.classList.add('form-signup-button-container--single');
        this.buttonContainer.classList.remove('form-signup-button-container--pair');
        this.form.append(this.buttonContainer);

        this.buttonContainer.append(this.nextButton);
        this.nextButton.onclick = (e) => {
            e.preventDefault();
            this.next();
        }

        this.form.append(new CaptchaBadge().render());
    }

    async onEmail () {
        this.stage = 'email';
        this.form.innerHTML = '';

        this.form.append(this.emailContainer);

        this.buttonContainer.innerHTML = '';
        this.buttonContainer.classList.remove('form-signup-button-container--single');
        this.buttonContainer.classList.add('form-signup-button-container--pair');
        this.form.append(this.buttonContainer);

        this.buttonContainer.append(this.backButton);
        this.buttonContainer.append(this.nextButton);

        this.nextButton.onclick = (e) => {
            e.preventDefault();
            if (!Validator.Email(this.email.value)) {
                this.email.input.focus();
                this.email.setInvalid();
                new Alert('Tu correo electrónico no es válido.', { error: true });
                return;
            };
            this.next();
        }

        this.form.append(new CaptchaBadge().render());
    }

    onUsername () {
        this.stage = 'username';
        this.form.innerHTML = '';

        this.form.append(this.usernameContainer);

        this.buttonContainer.innerHTML = '';
        this.buttonContainer.classList.remove('form-signup-button-container--single');
        this.buttonContainer.classList.add('form-signup-button-container--pair');
        this.form.append(this.buttonContainer);

        this.buttonContainer.append(this.backButton);
        this.buttonContainer.append(this.nextButton);
        this.nextButton.onclick = (e) => {
            e.preventDefault();

            if (!Validator.Username(this.username.value)) {
                this.username.input.focus();
                this.username.setInvalid();
                new Alert('Tu nombre de usuario no es válido.', { error: true });
                return;
            }

            this.next();
        }

        this.form.append(new CaptchaBadge().render());
    }

    onName () {
        this.stage = 'name';
        this.form.innerHTML = '';

        this.form.append(this.nameContainer);

        this.buttonContainer.innerHTML = '';
        this.buttonContainer.classList.remove('form-signup-button-container--single');
        this.buttonContainer.classList.add('form-signup-button-container--pair');
        this.form.append(this.buttonContainer);

        this.buttonContainer.append(this.backButton);
        this.buttonContainer.append(this.nextButton);
        this.nextButton.onclick = (e) => {
            e.preventDefault();

            if (!Validator.Name(this.name.value)) {
                this.name.input.focus();
                this.name.setInvalid();
                new Alert('Tu nombre no es válido.', { error: true });
                return;
            }

            this.next();
        }

        this.form.append(new CaptchaBadge().render());
    }

    onPassword () {
        this.stage = 'password';
        this.form.innerHTML = '';

        this.form.append(this.passwordContainer);

        this.form.append(this.passwordConfirmationContainer);

        this.buttonContainer.innerHTML = '';
        this.buttonContainer.classList.remove('form-signup-button-container--single');
        this.buttonContainer.classList.add('form-signup-button-container--pair');
        this.form.append(this.buttonContainer);

        this.buttonContainer.append(this.backButton);
        this.buttonContainer.append(this.nextButton);

        this.nextButton.textContent = 'Terminar';
        this.nextButton.onclick = (e) => {
            e.preventDefault();

            if (!Validator.Password(this.password.value)) {
                this.password.input.focus();
                this.password.setInvalid();
                new Alert('Elige otra clave.', { error: true });
                return;
            }

            if (this.password.value !== this.passwordConfirmation.value) {
                this.passwordConfirmation.input.focus();
                this.passwordConfirmation.setInvalid();
                new Alert('Las claves no coinciden.', { error: true });
                return;
            }

            this.submit();
        }

        this.backButton.onclick = (e) => {
            e.preventDefault();
            this.nextButton.textContent = 'Continuar →';
            this.nextButton.onclick = (e) => {
                e.preventDefault();
                this.next();
            }
            this.back();
        }

        this.form.append(new CaptchaBadge().render());
    }

    onVerify () {
        this.stage = 'verify';
        this.form.innerHTML = '';

        this.messageContainer = document.createElement('div');
        this.messageContainer.classList.add('form-signup-message-container');
        this.form.append(this.messageContainer);

        this.message = document.createElement('span');
        this.message.textContent = 'Te enviamos un correo para que puedas activar tu cuenta. Expira en 10 minutos. Recordá revisar tu carpeta de SPAM si no lo encontrás.';
        this.messageContainer.append(this.message);

        this.usedEmailContainer = document.createElement('div');
        this.usedEmailContainer.classList.add('form-signup-usedemail-container');
        this.form.append(this.usedEmailContainer)

        this.usedEmail = document.createElement('span');
        this.usedEmail.classList.add('link');
        this.usedEmail.textContent = this.email.value;
        this.usedEmailContainer.append(this.usedEmail);

        // this.buttonContainer.innerHTML = '';
        // this.buttonContainer.classList.add('form-signup-button-container--single');
        // this.buttonContainer.classList.remove('form-signup-button-container--pair');
        // this.form.append(this.buttonContainer);

        // this.buttonContainer.append(this.nextButton);
        // this.nextButton.textContent = 'Reenviar';
        // this.nextButton.onclick = (e) => {
        //     e.preventDefault();
        //     if (this.cooldown) {
        //         new Alert('Debes esperar para enviar otro correo.', { error: true });
        //         return;
        //     }

        //     this.nextButton.disabled = true;
        //     this.cooldown = true;
        //     setTimeout(() => {
        //         this.cooldown = false;
        //         this.nextButton.disabled = false;
        //     }, 60000 * 10);
        // }

        this.form.append(new CaptchaBadge().render());
    }
 
    back () {
        let i = this.stages.indexOf(this.stage) - 1;
        if (i < 0) i = 0;
        this.stage = this.stages[i];
        this.resolve();
    }

    next () {
        let i = this.stages.indexOf(this.stage) + 1;
        if (i >= this.stages.length) i = this.stages.length - 1;
        this.stage = this.stages[i];
        this.resolve();
    }

    async submit () {
        this.loader = new ScreenSpinner();

        grecaptcha.ready(() => {
            grecaptcha.execute('6LeMrAkrAAAAADDW0Gu_K5HfNWpSgx9zhyN0hl3O', { action: 'submit' }).then(async (token) => {
                try {
                    await authenticationService.signup({
                        captcha_token: token,
                        email: this.email.value,
                        username: this.username.value,
                        name: this.name.value,
                        password: this.password.value
                    });
                } catch (error) {
                    new Alert(error.message, { error: true });
                    this.loader.remove();
                    return;
                }

                this.loader.remove();
                this.onVerify();
            });
        });
    }

    render () {
        return this.form;
    }
}