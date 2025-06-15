import {URL_NO_IMAGE} from "../../consts.js";
import Helper from "../../Helper.js";

Helper.ImportCSS('/public/views/messages/styles/message.css');

class Message extends HTMLElement {
    constructor (data) {
        super();
        this.data = data;
        this.classList.add('message');

        this.icon = document.createElement('img');
        this.icon.classList.add('message-icon');
        this.icon.src = data.creator.icon_url || URL_NO_IMAGE;
        this.append(this.icon);

        this.container = document.createElement('div');
        this.container.classList.add('message-container');
        this.append(this.container);

        this.username = document.createElement('span');
        this.username.classList.add('message-username');
        this.username.textContent = data.creator.username;
        this.container.append(this.username);

        this.content = Helper.Format(data.content);
        this.content.classList.add('message-content');
        this.container.append(this.content);
    };
};

customElements.define('app-message', Message);
export default Message;