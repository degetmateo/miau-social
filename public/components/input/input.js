import Helper from "../../Helper.js";
import Component from "../Component.js";

Helper.ImportCSS('/public/components/input/styles/input.css');

export default class Input extends Component {
    constructor (options = {
        title: 'input',
        type: 'text',
        placeholder: null,
        max: 16,
        min: 0,
        onStop: () => {},
        autocomplete: null,
        length: true
    }) {
        super();
        this.options = options;
        this.max = options.max;
        this.min = options.min;
        this.value = '';
        this.timer;
        this.timerInterval = 700;

        this.container = document.createElement('div');
        this.container.classList.add('input-container');

        this.title = document.createElement('span');
        this.title.classList.add('input-title');
        this.title.innerText = options.title;
        if (options.title) this.container.appendChild(this.title);

        this.inputContainer = document.createElement('div');
        this.inputContainer.classList.add('input-input-container');
        this.container.append(this.inputContainer);

        this.input = document.createElement('input');
        this.input.classList.add('input-input');
        this.input.type = options.type;
        this.input.minLength = options.min;
        this.input.maxLength = options.max;
        this.input.autocomplete = options.autocomplete;
        this.input.autocorrect = 'off';
        if (this.options.placeholder) this.input.placeholder = this.options.placeholder;
        this.inputContainer.appendChild(this.input);

        this.length = document.createElement('span');
        this.length.classList.add('input-length');
        this.length.innerText = `0/${this.max}`;
        this.inputContainer.append(this.length);

        if (options.length === false) {
            this.length.remove();
        }

        this.container.onmousedown = (e) => {
            if (e.target !== this.input) e.preventDefault();
            this.input.focus();
        }
        this.input.onfocus = this.onFocus;
        this.input.onblur = this.onBlur;
        this.input.oninput = this.onInput;
    }

    setInvalid () {
        this.container.classList.add('input-container--invalid');
    }

    setValid () {
        this.container.classList.remove('input-container--invalid');
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

        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            if (this.options.onStop) this.options.onStop();
        }, this.timerInterval);
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