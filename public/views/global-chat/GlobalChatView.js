import Header from "../../components/header/Header.js";
import Nav from "../../components/nav/Nav.js";
import Helper from "../../Helper.js";
import router from "../../router.js";
import AbstractView from "../AbstractView.js";
import Message from "../messages/Message.js";

Helper.ImportCSS('/public/views/global-chat/global-chat.css');

export default class GlobalChatView extends AbstractView {
    constructor () {
        super();
        this.view = document.createElement('view');
        this.view.classList.add('global-chat-view');

        this.main = document.createElement('main');
        this.main.classList.add('global-chat-main');
        this.view.append(this.main);

        this.header = new Header({ text: 'General' });
        this.main.append(this.header);

        this.messages = document.createElement('div');
        this.messages.classList.add('global-chat-messages');
        this.main.append(this.messages);

        this.creator = document.createElement('div');
        this.creator.classList.add('global-chat-creator');
        this.main.append(this.creator);

        this.creatorTextContainer = document.createElement('div');
        this.creatorTextContainer.classList.add('global-chat-creator-text-container');
        this.creator.append(this.creatorTextContainer);

        this.creatorText = document.createElement('div')
        this.creatorText.contentEditable = true;
        this.creatorText.classList.add('global-chat-creator-text');
        this.creatorTextContainer.append(this.creatorText);

        this.creatorButtonContainer = document.createElement('div');
        this.creatorButtonContainer.classList.add('global-chat-creator-button-container');
        this.creatorTextContainer.append(this.creatorButtonContainer);

        this.creatorButton = document.createElement('button');
        this.creatorButton.classList.add('global-chat-creator-button');
        this.creatorButton.type = 'button';
        this.creatorButton.innerHTML = '<i class="fa-solid fa-arrow-right"></i>';
        this.creatorButtonContainer.append(this.creatorButton);

        this.whoIsWritingContainer = document.createElement('div');
        this.whoIsWritingContainer.classList.add('global-chat-writing-container');
        this.creator.append(this.whoIsWritingContainer);

        this.whoIsWriting = document.createElement('span');
        this.whoIsWriting.classList.add('global-chat-writing');

        this.whoIsWritingUsername = document.createElement('span');
        this.whoIsWriting.append(this.whoIsWritingUsername);

        this.whoIsWritingDots = document.createElement('span');
        this.whoIsWritingDots.classList.add('dots');
        this.whoIsWriting.append(this.whoIsWritingDots);

        this.creatorButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.submit();
        });

        this.typing = false;
        this.creatorText.addEventListener('keydown', (e) => {
            if (!this.typing) {
                this.typing = true;

                window.dispatchEvent(new CustomEvent('socket-emit-writing'));

                setTimeout(() => {
                    this.typing = false;
                }, 3000);
            };

            const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
            if (isMobile) return;
            
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.submit();
            };
        });

        this.counter = 0;
        window.addEventListener('socket-message', (e) => {
            const message = e.detail;
            this.counter++;
            if (!this.isActive()) {
                Nav.buttonMessages.setNumber(this.counter);
            } else {
                this.counter = 0;
            };

            if (this.messages.scrollTop == this.messages.scrollHeight) {
                this.messages.prepend(new Message(message));
                this.messages.scrollTop = this.messages.scrollHeight;
            } else {
                this.messages.prepend(new Message(message));
            };
        });

        this.writingTimeout = null;
        window.addEventListener('socket-writing', (e) => {
            const data = e.detail;

            this.whoIsWritingUsername.textContent = data.creator.username + ' está escribiendo';
            this.whoIsWritingContainer.append(this.whoIsWriting);
            
            if (this.writingTimeout) {
                this.whoIsWritingUsername.textContent = data.creator.username + ' está escribiendo';
                clearTimeout(this.writingTimeout);
                this.writingTimeout = null;
            };
            
            this.writingTimeout = setTimeout(() => {
                this.whoIsWriting.remove();
                this.writingTimeout = null;
            }, 3000);
        });
    };

    init () {
        this.setTitle('General');
        this.setView(this.view);
        this.view.prepend(Nav);
        this.counter = 0;
        Nav.buttonMessages.setNumber(this.counter);
    };

    reset () {
        this.messages.innerHTML = '';
        this.counter = 0;
    };

    submit () {
        if (!this.creatorText.innerText) return;
        if (!this.creatorText.innerText.trim()) return;
        if (this.creatorText.innerText.length > 512) return;

        this.typing = false;

        window.dispatchEvent(new CustomEvent('socket-emit-message', {
            detail: {
                content: this.creatorText.innerText.trim()
            }
        }));

        this.creatorText.innerText = '';
    };

    isActive () {
        return router.getPathname().startsWith('/chats/general');
    };
};