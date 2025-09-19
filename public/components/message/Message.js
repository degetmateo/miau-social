import Helper from "../../Helper.js";

Helper.ImportCSS('/public/components/message/message.css');

class Message extends HTMLElement {
    constructor (message) {
        super();
        this.classList.add('message');
        this.innerText = message.content;
    };

    setPending () {
        this.classList.add('message-pending');
    };

    removePending () {
        this.classList.remove('message-pending');
    };
};

customElements.define('app-message', Message);
export default Message;