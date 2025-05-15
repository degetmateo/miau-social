import {importCSS} from "../../helpers";
import HTMLObserver from "../../interfaces/HTMLObserver.js";
import Divider from "../divider/Divider.js";

importCSS('/public/components/timeline-cell/timeline-cell.css');

class TimelineCell extends HTMLObserver {
    constructor (node) {
        super();
        this.classList.add('timeline-cell');
        this.append(node);
        this.append(new Divider());
        node.onRemove = () => {
            this.remove();
        };
    };
};

customElements.define('app-timeline-cell', TimelineCell);
export default TimelineCell;