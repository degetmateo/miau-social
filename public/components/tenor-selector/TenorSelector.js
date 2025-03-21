import {importCSS, ScrollBottom} from "../../helpers.js";
import Observer from "../../interfaces/Observer.js";
import EventsHandler from "../../modules/EventsHandler.js";
import {tenorService} from "../../services/tenorService.js";
import Button from "../button/Button.js";
import Input from "../input/input.js";

importCSS('/public/components/tenor-selector/styles/tenor-selector.css');

export default class TenorSelector extends Observer {
    constructor (options = {
        onSubmit: () => {}
    }) {
        super();
        this.options = options;
        this.observerId = 'tenor-selector';

        EventsHandler.addObserver(this);

        this.container = document.createElement('div');
        this.container.classList.add('tenor-selector-container');
        document.getElementById('app').append(this.container);

        this.container.onclick = () => {
            this.remove();
        }

        this.selector = document.createElement('div');
        this.selector.classList.add('tenor-selector');
        this.container.append(this.selector);

        this.selector.onclick = (e) => {
            e.stopPropagation();
        }

        this.inputContainer = document.createElement('div');
        this.inputContainer.classList.add('tenor-selector-input-container');
        this.selector.append(this.inputContainer);

        this.input = new Input({
            min: 0, 
            max: 128, 
            title: 'Buscar GIF', 
            type: 'text',
            onStop: () => this.submit()
        });

        this.input.container.classList.add('tenor-selector-input');
        this.inputContainer.append(this.input.render());

        this.cancelButton = new Button({
            appearance: 'default',
            text: 'X',
            onClick: () => this.remove()
        });

        this.cancelButton.add('tenor-selector-cancel-button');
        this.inputContainer.append(this.cancelButton.render());

        this.resultsContainer = document.createElement('div');
        this.resultsContainer.classList.add('tenor-selector-results-container', 'tenor-selector-results-container--empty');
        this.selector.append(this.resultsContainer);

        this.resultsMessage = document.createElement('span');
        this.resultsMessage.textContent = 'Los resultados aparecerán acá.';
        this.resultsMessage.classList.add('tenor-selector-results-message');
        this.resultsContainer.append(this.resultsMessage);
    }

    async submit (next) {
        if (!this.input.value) return;
        const response = await tenorService.get({ args: this.input.value, pos: next || null });
        next ? '' : this.resultsContainer.innerHTML = '';
        this.resultsContainer.classList.remove('tenor-selector-results-container--empty');
        this.resultsContainer.classList.add('tenor-selector-results-container--content');

        for (const result of response.results) {
            const image = document.createElement('img');
            image.classList.add('tenor-selector-result');
            image.src = result['media_formats']['gif']['url'];
            image.onclick = () => {
                this.options.onSubmit(result['media_formats']['gif']['url']);
                this.remove();
            }
            this.resultsContainer.append(image);
        }

        ScrollBottom(this.resultsContainer, () => {
            this.submit(response.next);
        });
    }

    remove () {
        EventsHandler.removeObserver(this);
        this.container.remove();
    }

    onEscape () {
        this.remove();
    }
}