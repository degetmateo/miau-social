import {importCSS} from "../../helpers.js";
import router from "../../router.js";
import {memberService} from "../../services/memberService.js";
import Validators from "../../Validators.js";
import Alert from "../alert/alert.js";
import Input from "../input/input.js";
import ScreenSpinner from "../screen-spinner/ScreenSpinner.js";

importCSS('/public/components/form-update-username/form-update-username.css');

class FormUpdateUsername extends HTMLFormElement {
    constructor () {
        super();
        this.classList.add('form-update-username');
        
        this.username = new Input({
            autocomplete: "on",
            type: "text",
            title: "Nombre de usuario",
            length: true,
            max: 16,
            min: 1
        });
        this.username.container.classList.add('form-update-username-input');
        this.append(this.username.render());

        this.buttonContainer = document.createElement('div');
        this.buttonContainer.classList.add('form-update-username-button-container');
        this.append(this.buttonContainer);

        this.button = document.createElement('button');
        this.button.type = 'submit';
        this.button.classList.add('form-update-username-button');
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
            Validators.Username(this.username.value);
            const response = await memberService.updateUsername({ username: this.username.value });
            localStorage.setItem("token", response.token);
            loader.remove();
            new Alert("Actualizaste tu nombre de usuario.", { error: false });
            router.reload();
        } catch (error) {
            console.error(error);
            loader.remove();
            new Alert(error.message, { error: true });
        };
    };
};

customElements.define('form-update-username', FormUpdateUsername, { extends: 'form' });
export default FormUpdateUsername;