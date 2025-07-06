import Helper from "../../Helper.js";

Helper.ImportCSS('/public/components/chat/chat.css');

class Chat extends HTMLElement {
    constructor () {
        super();
        this.classList.add('chat');
        this.innerHTML = 'General';
    };
};

customElements.define('app-chat', Chat);
export default Chat;