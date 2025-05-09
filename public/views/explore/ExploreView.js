import Nav from "../../components/nav/Nav.js";
import {importCSS} from "../../helpers.js";
import AbstractView from "../AbstractView.js";

importCSS('/public/views/explore/explore.css');

export default class ExploreView extends AbstractView {
    constructor () {
        super();
        this.view = document.createElement('view');
        this.view.classList.add('explore-view');
    };

    init () {
        this.setTitle("Explorar");
        this.setView(this.view)
        this.view.append(Nav);
    };
};