import { importCSS } from "../../helpers";
import EventsHandler from "../../modules/EventsHandler.js";
import router from "../../router.js";
import AbstractView from "../AbstractView.js";

importCSS('/public/views/home/styles/home.css');

export default class extends AbstractView {
    constructor () {
        this.cooldown = false;
        this.limit = 20;
        this.offset = 0;
        this.observerId = 'home';
        this.timeline = 'global';

        this.view = document.createElement('div');
        this.view.classList.add('home-view');

        
    }

    async init (params) {
        this.params = params;
        this.setTitle('Inicio');

        EventsHandler.removeObserver(this);
        EventsHandler.addObserver(this);

        if (window.location.pathname === '/') return router.navigateTo('/home');

        this.clear();
        this.appContainer.appendChild(this.view);
    }

    changeTimeline (timeline) {
        this.timeline = timeline;
    }

    onVisibilityChange () {
        if (document.visibilityState != 'visible') return;
        if (window.location.pathname != '/home') return;
        if (this.cooldown) return;
        // if (document.visibilityState === 'visible') this.setTimeline();
        this.cooldown = true;
        setTimeout(() => {
            this.cooldown = false;
        }, 30000);
    }
}