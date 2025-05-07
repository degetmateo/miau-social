import Header from "../../components/header/Header.js";
import Notification from "/public/components/notification/notification.js";
import Separator from "../../components/separator/Separator.js";
import EventsHandler from "../../modules/EventsHandler.js";
import Notifier from "../../modules/Notifier.js";
import {notificationService} from "../../services/notificationService.js";
import AbstractView from "../AbstractView.js";
import {importCSS} from "../../helpers.js";
import Nav from "../../components/nav/Nav.js";

importCSS('/public/views/notifications/styles/notifications.css');

export default class NotificationsView extends AbstractView {
    constructor () {
        super();

        this.offset = 0;
        this.scroll = 0;
        this.limit = 20;
        this.firstLoad = true;
        this.notifications = [];
        this.observerId = 'notificationsView';
        this.unread = [];
        this.flag = false;

        EventsHandler.addObserver(this);

        this.view = document.createElement('view');
        this.view.classList.add('notifications-view');

        this.main = document.createElement('main');
        this.main.classList.add('notifications-main');
        this.view.append(this.main);

        this.header = new Header({
            text: 'Notificaciones'
        });
        this.header.onclick = (e) => {
            e.stopPropagation();
            this.main.scrollTo({ top: 0, behavior: 'instant' });
        };
        this.main.append(this.header);

        this.notificationsContainer = document.createElement('div');
        this.notificationsContainer.classList.add('container-notifications');
        this.main.append(this.notificationsContainer);

        this.eventScroll();
    }

    async init (params) {
        this.params = params;
        this.setTitle("Notificaciones");

        this.view.append(Nav);
        this.setView(this.view);

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
        this.notificationsContainer.innerHTML = '';
        
        const data = await notificationService.get({ offset: this.offset });

        for (const n of data) {
            const notification = new Notification(n);
            this.notifications.push(notification);
            this.notificationsContainer.append(notification);
            this.notificationsContainer.append(new Separator().render());
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
                    this.notificationsContainer.append(notification);
                    this.notificationsContainer.append(new Separator().render());
                }
            }
        });
    }

    onNotification = (unread) => {
        for (const n of unread) {
            const notification = new Notification(n);
            if (this.notifications.find(n => n.getID() === notification.getID())) return;
            this.notifications.push(notification);
            this.notificationsContainer.prepend(new Separator().render());
            this.notificationsContainer.prepend(notification);
        }
    }
}