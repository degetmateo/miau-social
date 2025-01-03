import {importCSS} from "../../helpers.js";
import Component from "../Component.js";

importCSS('/public/components/input/styles/input.css');

export default class Input extends Component {
    constructor (options = {
        title: 'input',
        type: 'text',
        max: 16,
        min: 0
    }) {
        super();
        this.max = options.max;
        this.min = options.min;
        this.value = '';

        this.container = document.createElement('div');
        this.container.classList.add('input-container');

        this.title = document.createElement('span');
        this.title.classList.add('input-title');
        this.title.innerText = options.title;
        this.container.appendChild(this.title);

        this.input = document.createElement('input');
        this.input.classList.add('input-input');
        this.input.type = options.type;
        this.container.appendChild(this.input);

        this.length = document.createElement('span');
        this.length.classList.add('input-length');
        this.length.innerText = `${this.min}/${this.max}`;
        this.container.appendChild(this.length);

        this.container.onmousedown = (e) => {
            e.preventDefault();
            this.input.focus();
        }
        this.input.onfocus = this.onFocus;
        this.input.onblur = this.onBlur;
        this.input.oninput = this.onInput;
    }

    isValid = () => {
        return this.value.length >= this.min && this.value.length <= this.max;
    }

    onFocus = () => {
        this.container.classList.add('input-container--active');
    }

    onBlur = () => {
        this.container.classList.remove('input-container--active');
    }

    onInput = () => {
        this.value = this.input.value;
        this.length.innerText = `${this.value.length}/${this.max}`;
        if (this.value.length > this.max || this.value.length < this.min) this.container.classList.add('input-container--invalid');
        else this.container.classList.remove('input-container--invalid');
    }

    destroy = () => {
        this.container.remove();
        this.input.removeEventListener('focus', this.onFocus);
        this.input.removeEventListener('blur', this.onBlur);
        this.input.removeEventListener('input', this.onInput);
    }

    render = () => {
        return this.container;
    }

    set = (value) => {
        this.input.value = value;
        this.onInput();
    }
}