import Alert from "../../components/alert/alert.js";
import Button from "../../components/button/Button.js";
import ScreenSpinner from "../../components/screen-spinner/ScreenSpinner.js";
import Form from "./Form.js";

class FormUpdateUsername extends Form {
    constructor () {
        super();
        this.css('/public/views/settings/styles/form-update-username.css');

        this.container = document.createElement('div');
        this.container.classList.add('form-container', 'form_update_username-container');

        this.title = document.createElement('h3');
        this.title.textContent = 'Actualiza tu nombre de usuario.';
        this.container.appendChild(this.title);

        this.message = document.createElement('span');
        this.message.innerHTML = `
            <p>Puede contener letras mayúsculas y minúsculas, guiones bajos y números. Debe ser único, te haremos saber si el nuevo ya está utilizado.</p>
        `;
        this.container.appendChild(this.message);

        this.inputContainer = document.createElement('div');
        this.inputContainer.classList.add('form_update_name-input_container');
        this.container.appendChild(this.inputContainer);

        this.input = document.createElement('input');
        this.input.type = 'text';
        this.input.placeholder = 'Nombre de usuario.';
        this.input.classList.add('input', 'form_update_name-input');
        this.inputContainer.appendChild(this.input);

        // this.button = document.createElement('button');
        // this.button.textContent = 'Enviar';
        // this.button.classList.add('button', 'form_update_name-button');

        this.button = new Button({
            text: 'Enviar',
            appearance: 'default',
            onClick: this.submit
        });

        this.inputContainer.appendChild(this.button.render());
        this.cooldown = false;
    }

    submit = async () => {
        const username = this.input.value;
        if (!username || username.length <= 0) return new Alert("Tenés que escribir algo.", { error: true });
        if (username.length > 16) return new Alert('Hasta 16 carácteres.', { error: true });
        this.input.value = '';

        if (this.cooldown) return new Alert("Esperá un rato.", { error: true });
        this.setCooldown();

        const spinner = new ScreenSpinner();
        const request = await fetch ('/api/member/update/username', {
            method: 'POST',
            headers: { 
                "Authorization": "Bearer " + localStorage.getItem('token'),
                "Content-Type": "Application/JSON"
            },
            body: JSON.stringify({ username })
        });
        const response = await request.json();
        spinner.remove();
        if (!request.ok) return new Alert(response.error.message, { error: true });

        window.app.member.username = username;
        window.app.nav.update();

        new Alert("¡Nombre de usuario actualizado!", { error: false });
    }

    node = () => {
        return this.container;
    }
}

export default new FormUpdateUsername();