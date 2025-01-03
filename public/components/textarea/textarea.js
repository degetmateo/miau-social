import {importCSS} from "../../helpers.js";
import Component from "../Component.js";

importCSS('/public/components/textarea/styles/textarea.css');

export default class Textarea extends Component {
    constructor (options = {
        title: 'input',
        max: 16,
        min: 0
    }) {
        super();
        this.max = options.max;
        this.min = options.min;
        this.value = '';

        this.container = document.createElement('div');
        this.container.classList.add('textarea-container');

        this.title = document.createElement('span');
        this.title.classList.add('textarea-title');
        this.title.innerText = options.title;
        this.container.appendChild(this.title);

        this.textarea = document.createElement('textarea');
        this.textarea.classList.add('textarea');
        this.container.appendChild(this.textarea);

        this.length = document.createElement('span');
        this.length.classList.add('textarea-length');
        this.length.innerText = `${this.min}/${this.max}`;
        this.container.appendChild(this.length);

        this.container.onclick = () => this.textarea.focus();

        this.textarea.onfocus = () => {
            this.container.classList.add('textarea-container--active');
        }

        this.textarea.onblur = () => {
            this.container.classList.remove('textarea-container--active');
        }

        this.textarea.oninput = this.onInput;
    }

    isValid = () => {
        return this.value.length >= this.min && this.value.length <= this.max;
    }

    onInput = () => {
        this.value = this.textarea.value;
        this.length.innerText = `${this.value.length}/${this.max}`;
        if (this.value.length > this.max || this.value.length < this.min) this.container.classList.add('textarea-container--invalid');
        else this.container.classList.remove('textarea-container--invalid');
    }

    render = () => {
        return this.container;
    }

    set = (value) => {
        this.textarea.value = value;
        this.onInput();
    }
}