import Helper from "../../Helper.js";

Helper.ImportCSS('/public/components/message-creator/message-creator.css');

class MessageCreator extends HTMLElement {
    constructor (data = {
        onTyping: () => {},
        onStopTyping: () => {}
    }) {
        super();
        this.classList.add('message-creator');

        this.input = document.createElement('div');
        this.input.contentEditable = true;
        this.input.classList.add('message-creator-input');

        this.append(this.input);

        this.button = document.createElement('button');
        this.button.type = 'submit';
        this.button.textContent = '›';
        this.button.classList.add('message-creator-button');

        this.append(this.button);

        this.typing = false;

        this.button.addEventListener('click', (e) => {
            e.preventDefault();
            this.submit();
        });

        this.input.addEventListener('keydown', (e) => {
            if (!this.typing) {
                this.typing = true;

                window.app.socket.emit('writing', localStorage.getItem('token'));

                setTimeout(() => {
                    this.typing = false;
                }, 5000);
            };

            const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
            if (isMobile) return;
            
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.submit();
            };
        });
    };

    async submit () {
        if (!this.input.innerText) return;
        if (!this.input.innerText.trim()) return;
        if (this.input.innerText.length > 512) return;

        this.typing = false;

        window.app.socket.emit('chat-message', {
            token: localStorage.getItem('token'),
            content: this.input.innerText.trim() 
        });

        this.input.innerText = '';
    };
};

customElements.define('message-creator', MessageCreator);
export default MessageCreator;