import {URL_NO_IMAGE} from "../../consts.js";
import Helper from "../../Helper.js";
import EventsHandler from "../../modules/EventsHandler.js";
import Component from "../Component.js";

Helper.ImportCSS('/public/components/image-viewer/styles/image-viewer.css');

export default class ImageViewer extends Component {
    constructor (data = {
        url: URL_NO_IMAGE
    }) {
        super();
        this.observerId = 'viewer';
        EventsHandler.addObserver(this);

        this.container = document.createElement('div');
        this.container.classList.add('viewer-container');

        this.viewer = document.createElement('img');
        this.viewer.classList.add('viewer');
        this.viewer.src = data.url;
        this.container.appendChild(this.viewer);
        document.getElementById('app').appendChild(this.container);

        this.container.onclick = (e) => {
            if (e.target != this.container) return;
            this.close();
        }

        this.scale = 1;
        this.container.onwheel = (e) => {
            e.preventDefault();
            const delta = e.deltaY;

            delta > 0 ?
                this.scale = Math.max(0.1, this.scale - 0.1) :
                this.scale = Math.min(3, this.scale + 0.1);
            
            this.viewer.style.transform = `scale(${this.scale})`;
        }
    }

    close () {
        this.container.remove();
        EventsHandler.removeObserver(this);
    }

    onEscape () {
        this.close();
    }
}