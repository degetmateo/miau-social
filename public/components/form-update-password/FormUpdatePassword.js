import {importCSS} from "../../helpers.js";
import router from "../../router.js";
import {memberService} from "../../services/memberService.js";
import Validators from "../../Validators.js";
import Alert from "../alert/alert.js";
import Input from "../input/input.js";
import ScreenSpinner from "../screen-spinner/ScreenSpinner.js";

importCSS('/public/components/form-update-password/form-update-password.css');

class FormUpdatePassword extends HTMLFormElement {
    constructor () {
        super();
        this.classList.add('form-update-password');
        
        this.actualPassword = new Input({
            autocomplete: "password",
            type: "password",
            title: "Contraseña actual",
            length: false,
            max: 128,
            min: 0
        });
        this.actualPassword.container.classList.add('form-update-password-input');
        this.append(this.actualPassword.render());

        this.newPasword = new Input({
            autocomplete: "new-password",
            type: "password",
            title: "Nueva contraseña",
            length: false,
            max: 128,
            min: 0
        });

        this.newPasword.container.classList.add('form-update-password-input');
        this.append(this.newPasword.render());

        this.confirmation = new Input({
            autocomplete: "new-password",
            type: "password",
            title: "Confirmá tu contraseña",
            length: false,
            max: 128,
            min: 0
        });

        this.confirmation.container.classList.add('form-update-password-input');
        this.append(this.confirmation.render());

        this.buttonContainer = document.createElement('div');
        this.buttonContainer.classList.add('form-update-password-button-container');
        this.append(this.buttonContainer);

        this.button = document.createElement('button');
        this.button.type = 'submit';
        this.button.classList.add('form-update-password-button');
        this.button.innerText = 'Actualizar';
        this.buttonContainer.append(this.button);

        this.onsubmit = (e) => {
            e.preventDefault();
            this.submit();
        };

        this.button.onclick = (e) => {
            e.preventDefault();
            this.submit();
        };
    };

    async submit () {
        const loader = new ScreenSpinner();
        try {
            if (!this.actualPassword.value) throw new Error("Tenés que escribir tu contraseña.");
            if (!this.actualPassword.value.trim()) throw new Error("Tenés que escribir tu contraseña.");
            Validators.Password(this.newPasword.value);
            if (this.newPasword.value !== this.confirmation.value) throw new Error("Tus contraseñas no coinciden.");

            await memberService.updatePassword({ 
                password: this.actualPassword.value,
                new_password: this.newPasword.value
            });

            this.actualPassword.set('');
            this.newPasword.set('');
            this.confirmation.set('');

            loader.remove();
            new Alert("Se actualizó tu contraseña.", { error: false });
        } catch (error) {
            console.error(error);
            loader.remove();
            new Alert(error.message, { error: true });
        };
    };
};

customElements.define('form-update-password', FormUpdatePassword, { extends: 'form' });
export default FormUpdatePassword;