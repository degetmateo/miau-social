import router from "../../router.js";

class FormLogout {
    constructor () {
        this.container = document.createElement('div');
        this.container.classList.add('form_logout-container');

        this.buttonLogout = document.createElement('button');
        this.buttonLogout.classList.add('form_logout-button');
        this.buttonLogout.textContent = 'Cerrar Sesión';

        this.container.appendChild(this.buttonLogout);
        this.EventLogout();
    }

    getNode = () => {
        return this.container;
    };

    EventLogout = async () => {
        this.buttonLogout.onclick = () => {
            localStorage.removeItem('token');
            router.navigateTo('/login');
            return;
        }
    }
}

export default new FormLogout();