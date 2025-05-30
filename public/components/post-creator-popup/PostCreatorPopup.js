import {importCSS} from "../../helpers.js";
import Observer from "../../interfaces/Observer.js";
import EventsHandler from "../../modules/EventsHandler.js";
import PostCreator from "../post-creator/PostCreator.js";
import Separator from "../separator/Separator.js";

importCSS('/public/components/post-creator-popup/post-creator-popup.css');

const SVG_CLOSE = new Image();
SVG_CLOSE.src = '/public/assets/close.svg';
SVG_CLOSE.classList.add('svg-close', 'post-creator-popup-header-close');

export default class PostCreatorPopup extends Observer {
    constructor (data = {
        alert: '¡Publicación enviada!',
        title: '¿Qué pensás?',
        target_post_id: null,
        type: 'default',
        onSuccess: () => {}
    }) {
        super();
        this.data = data;
        this.observerId = 'post-creator-popup';
        EventsHandler.addObserver(this);

        this.popup = document.createElement('div');
        this.popup.classList.add('post-creator-popup');
        document.getElementById('app').append(this.popup);

        this.popup.onclick = (e) => {
            e.stopPropagation();
            if (e.target.closest('.post-creator-popup-container')) return;
            this.remove();
        }

        this.container = document.createElement('div');
        this.container.classList.add('post-creator-popup-container');
        this.popup.append(this.container);

        this.header = document.createElement('header');
        this.header.classList.add('post-creator-popup-header');
        this.container.append(this.header);

        this.close = SVG_CLOSE.cloneNode(true);
        this.close.onclick = () => {
            this.remove();
        }
        this.header.append(this.close);

        this.container.append(new Separator().render());

        this.creator = new PostCreator({
            alert: data.alert,
            title: data.title,
            target_id: data.target_post_id,
            type: data.type
        });

        this.creator.updateIcon(window.app.member.icon_url);
        this.creator.updateName(window.app.member.name);
        this.creator.onSuccess((post) => {
            if (this.data.onSuccess) this.data.onSuccess(post);
            this.remove();
        });
        this.container.append(this.creator);
    }

    onEscape () {
        this.remove();
    }

    remove () {
        this.popup.remove();
        EventsHandler.removeObserver(this);
    }
}