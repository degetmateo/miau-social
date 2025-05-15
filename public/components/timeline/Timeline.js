import {importCSS} from "../../helpers.js";
import HTMLObserver from "../../interfaces/HTMLObserver.js";
import Divider from "../divider/Divider.js";

importCSS('/public/components/timeline/timeline.css');

class Timeline extends HTMLObserver {
    constructor () {
        super();
        this.classList.add('timeline');
    };

    append (nodes) {
        const cell = document.createElement('div');
        cell.classList.add('timeline-cell');
        cell.append(nodes);
        cell.append(new Divider());
        super.append(cell);
    };

    prepend (nodes) {
        const cell = document.createElement('div');
        cell.classList.add('timeline-cell');
        cell.prepend(new Divider());
        cell.prepend(nodes);
        super.prepend(cell);
    };
};

customElements.define('app-timeline', Timeline);
export default Timeline;