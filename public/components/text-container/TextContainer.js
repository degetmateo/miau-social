import Helper from "../../Helper.js";

Helper.ImportCSS('/public/components/text-container/text-container.css');

class TextContainer extends HTMLElement {
    constructor (placeholder = '¿Qué pensás?') {
        super();
        this.classList.add('text-container');
        this.contentEditable = true;
        this.value = '';

        // this.addEventListener('keydown', (e) => {
        //     const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        //     if (isMobile) return;
            
        //     if (e.key === 'Enter' && !e.shiftKey) {
        //         e.preventDefault();
        //         return this.onEnter();
        //     };
        // });

        if (placeholder) {
            this.placeholder = document.createElement('span');
            this.placeholder.textContent = placeholder;
            this.placeholder.classList.add('post-creator-textarea-placeholder');
            this.textarea.append(this.placeholder);
        };

        this.addEventListener('input', () => {
            this.value = this.textarea.innerText;
        });

        this.addEventListener('focus', () => {
            if (placeholder) this.placeholder.remove();
        });

        this.addEventListener('blur', () => {
            if (!this.textarea.innerText || !this.textarea.innerText.trim()) {
                this.value = '';
                this.textarea.innerHTML = '';
                if (placeholder) this.textarea.append(this.placeholder);
            };
        });
    };
};

customElements.define('text-container', TextContainer);
export default TextContainer;