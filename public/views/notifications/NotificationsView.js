import Notification from "../../components/notification/notification.js";
import EventsHandler from "../../modules/EventsHandler.js";
import Notifier from "../../modules/Notifier.js";
import {notificationService} from "../../services/notificationService.js";
import AbstractView from "../AbstractView.js";

export default class NotificationsView extends AbstractView {
    constructor () {
        super();

        this.offset = 0;
        this.scroll = 0;
        this.limit = 20;
        this.firstLoad = true;

        this.notifications = [];

        this.unread = [];
        this.flag = false;

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

    async init (params) {
        this.params = params;
        this.clear();
        this.setTitle("Notificaciones");

        EventsHandler.removeObserver(this);
        EventsHandler.addObserver(this);

        this.viewContainer.appendChild(window.app.nav.getNode());
        this.appContainer.appendChild(this.viewContainer);

        if (this.firstLoad) {
            this.firstLoad = false;
            this.CreateMain();
        } else {
            this.setScroll(this.scroll);
            this.read();
        }
    }

    setScroll (scroll) {
        this.scroll = scroll;
        this.main.scrollTop = scroll;
    }
 
    async CreateMain () {
        this.setScroll(0);
        this.container_notifications.innerHTML = '';
        
        const data = await notificationService.get({ offset: this.offset });

        for (const n of data) {
            const notification = new Notification(n);
            this.notifications.push(notification);
            this.container_notifications.appendChild(notification.getElement());
        }

        this.read();
    }

    async read () {
        Notifier.setRead();
        await notificationService.read();
    }

    eventScroll () {
        this.main.addEventListener('scroll', async () => {
            const scrollHeight = this.main.scrollHeight;
            const clientHeight = this.main.clientHeight;
            this.scroll = this.main.scrollTop;
            const umbral = 1;

            if (this.scroll + clientHeight >= scrollHeight - umbral) {
                this.offset += this.limit;
                const data = await notificationService.get({ offset: this.offset });
                
                for (const n of data) {
                    const notification = new Notification(n);
                    this.notifications.push(notification);
                    this.container_notifications.appendChild(notification.getElement());
                }
            }
        });
    }

    onNotification = (unread) => {
        for (const n of unread) {
            const notification = new Notification(n);
            if (this.notifications.find(n => n.getID() === notification.getID())) return;
            this.notifications.push(notification);
            this.container_notifications.prepend(notification.getElement());
        }
    }
}