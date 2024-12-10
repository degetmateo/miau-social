import Alert from "../../components/alert/alert.js";
import Form from "./Form.js";

class FormUpdatePassword extends Form {
    constructor () {
        super();
        this.css('/public/views/settings/styles/form-update-password.css');

        this.container = document.createElement('div');
        this.container.classList.add('form_update_password-container');

        this.title = document.createElement('h3');
        this.title.textContent = 'Actualizar contraseña.';

        this.inputPassword = document.createElement('input');
        this.inputPassword.type = 'password';
        this.inputPassword.placeholder = 'Tu contraseña.';
        this.inputPassword.autocomplete = 'off';
        this.inputPassword.classList.add('input', 'form_update_password-input');

        this.inputNewPassword = document.createElement('input');
        this.inputNewPassword.type = 'password';
        this.inputNewPassword.placeholder = 'Tu nueva contraseña.';
        this.inputNewPassword.autocomplete = 'off';
        this.inputNewPassword.classList.add('input', 'form_update_password-input');

        this.inputConfirmNewPassword = document.createElement('input');
        this.inputConfirmNewPassword.type = 'password';
        this.inputConfirmNewPassword.placeholder = 'Confirma tu nueva contraseña.';
        this.inputConfirmNewPassword.autocomplete = 'off';
        this.inputConfirmNewPassword.classList.add('input', 'form_update_password-input');

        this.button = document.createElement('button');
        this.button.classList.add('button', 'form_update_password-button');
        this.button.textContent = 'Enviar';

        this.container.appendChild(this.title);
        this.container.appendChild(this.inputPassword);
        this.container.appendChild(this.inputNewPassword);
        this.container.appendChild(this.inputConfirmNewPassword);
        this.container.appendChild(this.button);

        this.event();
    }

    node = () => {
        return this.container;
    }

    event = () => {
        this.button.onclick = async () => {
            const password = this.inputPassword.value;
            const newPassword = this.inputNewPassword.value;
            const newPasswordConfirmation = this.inputConfirmNewPassword.value;

            if (!password || password.length <= 0) return new Alert('Tenés que ingresar tu contraseña actual.');
            if (!newPassword || newPassword.length <= 5) return new Alert('Tenés ingresar una nueva contraseña más larga.');
            if (newPassword != newPasswordConfirmation) return new Alert('Tu nueva contraseña y su confirmación no coinciden.');
            this.inputPassword.value = '';
            this.inputNewPassword.value = '';
            this.inputConfirmNewPassword.value = '';

            if (this.cooldown) return new Alert("Esperá un rato antes de volver a intentarlo.");
            this.setCooldown();

            const request = await fetch('/api/member/update/password', {
                method: 'POST',
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem('token'),
                    "Content-Type": "Application/JSON"
                },
                body: JSON.stringify({ password, new_password: newPassword })
            });
            
            const response = await request.json();
            if (!request.ok) return new Alert(response.error.message);
            new Alert('Contraseña actualizada.'); 
        }
    }
}

export default new FormUpdatePassword();