import {importCSS} from "../../helpers.js";
import Component from "../Component.js";

importCSS('/public/components/textarea/styles/textarea.css');

export default class Textarea extends Component {
    constructor (options = {
        title: 'input',
        max: 16,
        min: 0,
        expand: false,
        onPaste: () => {},
        onInput: () => {}
    }) {
        super();
        this.options = options;
        this.max = options.max;
        this.min = options.min;
        this.value = '';
        this.expand = options.expand;

        this.container = document.createElement('div');
        this.container.classList.add('textarea-container');

        this.title = document.createElement('span');
        this.title.classList.add('textarea-title');
        this.title.innerText = options.title;
        this.container.appendChild(this.title);

        this.textarea = document.createElement('textarea');
        this.textarea.classList.add('textarea');
        if (this.expand) {
            this.textarea.classList.add('textarea--expand');
        }
        this.textarea.minLength = options.min;
        this.textarea.maxLength = options.max;
        this.container.appendChild(this.textarea);

        this.length = document.createElement('span');
        this.length.classList.add('textarea-length');
        this.length.innerText = `${this.min}/${this.max}`;
        this.container.appendChild(this.length);

        this.container.onmousedown = (e) => {
            if (e.target !== this.textarea) e.preventDefault();
            this.textarea.focus();
        }

        this.textarea.onfocus = () => {
            this.container.classList.add('textarea-container--active');
        }

        this.textarea.onblur = () => {
            this.container.classList.remove('textarea-container--active');
        }

        this.textarea.oninput = this.onInput;
        this.textarea.onpaste = this.onPaste;
    }

    isValid = () => {
        return this.value.length >= this.min && this.value.length <= this.max;
    }

    onInput = () => {
        this.value = this.textarea.value;
        this.length.innerText = `${this.value.length}/${this.max}`;
        if (this.value.length > this.max || this.value.length < this.min) this.container.classList.add('textarea-container--invalid');
        else this.container.classList.remove('textarea-container--invalid');

        if (this.expand) {
            this.textarea.style.height = 'auto';
            this.textarea.style.height = `${this.textarea.scrollHeight}px`;
        }

        if (this.options.onInput) this.options.onInput(this.value);
    }

    render = () => {
        return this.container;
    }

    set = (value) => {
        this.textarea.value = value;
        this.onInput();
    }

    onPaste = (e) => {
        // si se pega una imagen pasarla como blob a la funcion de parametro
        if (e.clipboardData.files.length) {
            e.preventDefault();
            if (this.options.onPaste) this.options.onPaste(e.clipboardData.files[0]);
        }
    }
}