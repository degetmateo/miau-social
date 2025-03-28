import {importCSS} from "../../helpers";
import Observer from "../../interfaces/Observer";
import EventsHandler from "../../modules/EventsHandler";

importCSS('/public/components/post-options-popup/post-options-popup.css');

const SVG_CLOSE = new Image();
SVG_CLOSE.src = '/public/assets/close.svg';
SVG_CLOSE.classList.add('svg-close', 'post-creator-popup-header-close');

export default class PostOptionsPopup extends Observer {
    constructor (data) {
        this.data = data;

        EventsHandler.addObserver(this);

        this.container = document.createElement('div');
        this.container.classList.add('post-options-popup-container');
        document.getElementById('app').append(this.container);

        this.container.onclick = (e) => {
            e.stopPropagation();
            if (e.target.closest('.post-options-popup')) return;
            this.remove();
        }

        this.options = document.createElement('div');
        this.options.classList.add('post-options-popup');
        this.container.append(this.options);

        this.header = document.createElement('header');
        this.header.classList.add('post-options-popup-header');
        this.options.append(this.header);

        this.close = SVG_CLOSE.cloneNode(true);
        this.header.append(this.close);

        this.buttons = document.createElement('div');
        this.buttons.classList.add('post-options-popup-buttons');
        this.options.append(this.buttons);

        
    }

    onEscape () {
        this.remove();
    }

    remove () {
        this.container.remove();
        EventsHandler.removeObserver(this);
    }
}