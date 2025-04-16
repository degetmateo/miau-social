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
        this.buttonLogout.onclick = (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            window.app.logged = false;
            window.app = {};
            router.navigateTo('/');
            return;
        }
    }
}

export default new FormLogout();