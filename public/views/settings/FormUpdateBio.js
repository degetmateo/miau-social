import Alert from "../../components/alert/alert.js";

class FormUpdateBio {
    constructor () {
        this.container = document.createElement('container');
        this.container.classList.add('form_update_bio-container');

        this.formUpdateBioMessage = document.createElement('h3');
        this.formUpdateBioMessage.textContent = 'Actualizar biografía.';
        this.container.appendChild(this.formUpdateBioMessage);

        this.formUpdateBioTextarea = document.createElement('textarea');
        this.formUpdateBioTextarea.placeholder = 'Escribe tu nueva biografía.';
        this.formUpdateBioTextarea.classList.add('form_update_bio-textarea');
        this.container.appendChild(this.formUpdateBioTextarea);

        this.formUpdateBioButton = document.createElement('button');
        this.formUpdateBioButton.classList.add('form_logout-button');
        this.formUpdateBioButton.textContent = 'Enviar';
        this.container.appendChild(this.formUpdateBioButton);

        this.cooldown = false;

        this.EventButton();
    }

    EventButton = () => {
        this.formUpdateBioButton.onclick = async () => {
            const value = this.formUpdateBioTextarea.value;
            if (this.cooldown) return new Alert("Esperá un rato flaco.");
            this.setCooldown();
            this.formUpdateBioTextarea.value = '';
            const request = await fetch('/api/member/update/bio', {
                method: 'POST',
                headers: { 
                    "Authorization": "Bearer " + localStorage.getItem('token'),    
                    "Content-Type": "Application/JSON"
                },
                body: JSON.stringify({
                    bio: value
                })
            });
            const response = await request.json();
            if (!request.ok) return new Alert(response.error.message);
            new Alert('Biografia actualizada correctamente.');
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

    hide = () => {
        this.container.style.display = 'none';
    }

    show = () => {
        this.container.style.display = 'flex';
    }
}

export default new FormUpdateBio();