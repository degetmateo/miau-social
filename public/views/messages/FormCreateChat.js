import Helper from "../../Helper.js";

Helper.ImportCSS('/public/views/messages/form-create-chat.css');

class FormCreateChat extends HTMLElement {
    constructor () {
        super();
        this.form = document.createElement('form');
        this.form.classList.add('form-create-chat');
        this.append(this.form);

        this.button = document.createElement('button');
        this.button.classList.add('form-create-chat-button');
        this.button.type = 'button';
        this.button.textContent = 'EMPEZAR UN CHAT';
        this.button.addEventListener('click', () => this.init());
        this.form.append(this.button);
    };

    init () {
        console.log('click');
    };
};

customElements.define('form-create-chat', FormCreateChat);
export default FormCreateChat;