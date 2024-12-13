import Alert from "../../components/alert/alert.js";

class FormUpdateName {
    constructor () {
        this.css();

        this.container = document.createElement('div');
        this.container.classList.add('form-container', 'form_update_name-container');
        
        this.title = document.createElement('h3');
        this.title.textContent = 'Actualiza tu nombre de perfil.';
        this.container.appendChild(this.title);

        this.inputContainer = document.createElement('div');
        this.inputContainer.classList.add('form_update_name-input_container');
        this.container.appendChild(this.inputContainer);

        this.input = document.createElement('input');
        this.input.type = 'text';
        this.input.placeholder = 'Nombre de perfil.';
        this.input.classList.add('input', 'form_update_name-input');
        this.inputContainer.appendChild(this.input);

        this.button = document.createElement('button');
        this.button.textContent = 'Enviar';
        this.button.classList.add('button', 'form_update_name-button');
        this.inputContainer.appendChild(this.button);
        this.cooldown = false;
        this.event();
    }

    event = () => {
        this.button.onclick = async () => {
            const name = this.input.value;
            if (!name || name.length <= 0) return new Alert("Tenés que escribir algo.", { error: true });
            if (name.length > 16) return new Alert('Hasta 16 carácteres.', { error: true });
            this.input.value = '';

            if (this.cooldown) return new Alert("Esperá un rato.", { error: true });
            this.setCooldown();

            const request = await fetch ('/api/member/update/name', {
                method: 'POST',
                headers: { 
                    "Authorization": "Bearer " + localStorage.getItem('token'),
                    "Content-Type": "Application/JSON"
                },
                body: JSON.stringify({ name })
            });
            const response = await request.json();
            if (!request.ok) return new Alert(response.error.message, { error: true });
            new Alert("Nombre actualizado.");
        }
    }

    setCooldown = () => {
        this.cooldown = true;
        setTimeout(() => {
            this.cooldown = false;
        }, 30000);
    }

    node = () => {
        return this.container;
    }

    css = () => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/public/views/settings/styles/form-update-name.css';
        document.head.appendChild(link);
    }

    hide = () => {
        this.container.style.display = 'none';
    }
}

export default new FormUpdateName();