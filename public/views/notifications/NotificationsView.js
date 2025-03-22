import Notification from "../../components/notification/notification.js";
import EventsHandler from "../../modules/EventsHandler.js";
import AbstractView from "../AbstractView.js";

export default class NotificationsView extends AbstractView {
    constructor () {
        super();

        this.offset = 0;
        this.scroll = 0;
        this.limit = 20;
        this.firstLoad = true;

        this.viewContainer = document.createElement('div');
        this.viewContainer.classList.add('container-view', 'container-view-notifications');

        this.main = document.createElement('main');
        this.main.classList.add('notifications-view-main');
        this.container_notifications = document.createElement('div');
        this.container_notifications.classList.add('container-notifications');
        this.main.appendChild(this.container_notifications);
        this.viewContainer.appendChild(this.main);

        this.observerId = 'notificationsView';

        this.eventScroll();
    }

    onVisibilityChange = () => {
        if (document.visibilityState != 'visible') return;
        this.drawNotifications(window.app.notifier.get());
    }

    onNotifications = () => {
        this.drawNotifications(window.app.notifier.get());
    }

    async init (params) {
        this.params = params;
        this.clear();
        this.setTitle("Notificaciones");

        EventsHandler.removeObserver(this);
        EventsHandler.addObserver(this);

        window.app.notifier.removeObserver(this.observerId);
        window.app.notifier.addObserver(this);

        this.viewContainer.appendChild(window.app.nav.getNode());
        this.appContainer.appendChild(this.viewContainer);

        if (this.firstLoad) {
            this.firstLoad = false;
            this.CreateMain();
        } else {
            this.setScroll(this.scroll);
        }
    }

    setScroll (scroll) {
        this.scroll = scroll;
        this.main.scrollTop = scroll;
    }
 
    async CreateMain () {
        this.drawNotifications(await window.app.notifier.fetch(0));
        window.app.notifier.read();
    }

    async drawNotifications (_entries) {
        this.container_notifications.innerHTML = '';
        for (const n of _entries) {
            const notification = new Notification(n);
            if (n.status === 'pending') notification.setUnread();
            this.container_notifications.appendChild(notification.getElement());
        }
    }

    eventScroll () {
        this.main.addEventListener('scroll', async () => {
            const scrollHeight = this.main.scrollHeight;
            const clientHeight = this.main.clientHeight;
            this.scroll = this.main.scrollTop;
            const umbral = 1;

            if (this.scroll + clientHeight >= scrollHeight - umbral) {
                this.offset += this.limit;
                const notifications = await window.app.notifier.fetch(this.offset);
                window.app.notifier.insertAfter(notifications);
                this.drawNotifications(window.app.notifier.get());
            }
        });
    }
}