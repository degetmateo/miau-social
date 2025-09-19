import {URL_NO_IMAGE} from "../../consts.js";
import Helper from "../../Helper.js";
import Message from "../message/Message.js";

Helper.ImportCSS('/public/components/message-block/message-block.css');

class MessageBlock extends HTMLElement {
    constructor (member) {
        super();
        this.classList.add('message-block');

        this.iconContainer = document.createElement('div');
        this.iconContainer.classList.add('message-block-icon-container');
        this.append(this.iconContainer);

        this.icon = document.createElement('img');
        this.icon.classList.add('message-block-icon');
        this.icon.src = member.icon_url || URL_NO_IMAGE;
        this.icon.onerror = () => this.icon.src = URL_NO_IMAGE;
        this.iconContainer.append(this.icon);

        this.contentContainer = document.createElement('div');
        this.contentContainer.classList.add('message-block-content-container');
        this.append(this.contentContainer);

        this.memberName = document.createElement('span');
        this.memberName.classList.add('message-block-member-name');
        this.memberName.textContent = member.name;
        this.contentContainer.append(this.memberName);

        this.messagesContainer = document.createElement('div');
        this.messagesContainer.classList.add('message-block-messages-container');
        this.contentContainer.append(this.messagesContainer);
    };

    addMessage (message) {
        const m = new Message(message);
        this.messagesContainer.append(m);
        return m;
    };
};

customElements.define('message-block', MessageBlock);
export default MessageBlock;