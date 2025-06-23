import Header from "../../components/header/Header.js";
import EventsHandler from "../../modules/EventsHandler.js";
import Notifier from "../../modules/Notifier.js";
import {notificationService} from "../../services/notificationService.js";
import AbstractView from "../AbstractView.js";
import {Scroll} from "../../helpers.js";
import Nav from "../../components/nav/Nav.js";
import Spinner from "../../components/spinner/Spinner.js";
import Helper from "../../Helper.js";
import Notification from "../../components/notification/Notification.js";

Helper.ImportCSS('/public/views/notifications/styles/notifications.css');

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
        this.fetching = false;
        this.spinner = new Spinner();

        EventsHandler.addObserver(this);

        this.view = document.createElement('view');
        this.view.classList.add('notifications-view');

        this.nav = document.createElement('div');
        this.view.append(this.nav);

        this.main = document.createElement('main');
        this.main.classList.add('notifications-main');
        this.view.append(this.main);

        this.header = new Header({
            text: 'Notificaciones'
        });
        this.header.onclick = (e) => {
            e.stopPropagation();
            this.view.scrollTo({ top: 0, behavior: 'instant' });
        };
        this.main.append(this.header);

        this.notificationsContainer = document.createElement('div');
        this.notificationsContainer.classList.add('container-notifications');
        this.main.append(this.notificationsContainer);

        Scroll({
            element: this.view,
            scroll: (scroll) => {
                this.scroll = scroll;
            },
            bottom: async () => {
                if (this.fetching) return;
                this.fetching = true;
                this.main.append(this.spinner);
                this.offset += this.limit;
                const data = await notificationService.get({ offset: this.offset });
                for (const n of data) {
                    const notification = new Notification(n);
                    this.notifications.push(notification);
                    this.notificationsContainer.append(notification);
                }
                this.spinner.remove();
                this.fetching = false;
            }
        });

        window.addEventListener('socket-notification', (e) => {
            const notification = new Notification(e.detail);
            this.notifications.push(notification);
            this.notificationsContainer.prepend(notification);
        });

        window.addEventListener('socket-notification-deleted', (e) => {
            const notification = this.notifications.find(n => n.data.id == e.detail.id_notification);
            if (notification) notification.remove();
        });
    };

    reset () {
        this.offset = 0;
        this.scroll = 0;
        this.limit = 20;
        this.firstLoad = true;
        this.notifications = [];
        this.observerId = 'notificationsView';
        this.unread = [];
        this.flag = false;
        this.fetching = false;
        this.spinner = new Spinner();
        this.notificationsContainer.innerHTML = '';
    };

    async init (params) {
        this.params = params;
        this.setTitle("Notificaciones");

        this.nav.append(Nav);
        this.setView(this.view);

        if (this.firstLoad) {
            this.firstLoad = false;
            this.CreateMain();
        } else {
            this.setScroll(this.scroll);
            Notifier.read();
            await notificationService.read();
        }
    }

    setScroll (scroll) {
        this.scroll = scroll;
        this.view.scrollTop = scroll;
    }
 
    async CreateMain () {
        this.setScroll(0);
        this.notificationsContainer.innerHTML = '';
        
        this.main.append(this.spinner);

        const data = await notificationService.get({ offset: this.offset });
        for (const n of data) {
            const notification = new Notification(n);
            this.notifications.push(notification);
            this.notificationsContainer.append(notification);
        }
        this.spinner.remove();
        await notificationService.read();
    };
};