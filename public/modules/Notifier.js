import Nav from "../components/nav/Nav.js";
import router from "../router.js";
import {notificationService} from "../services/notificationService.js";

class Notifier {
    constructor () {
        this.notifications = [];
    }

    initialize () {
        if (router.getPathname() != '/notifications') this.get();

        window.addEventListener('socket-notification', (e) => {
            if (this.notifications.find(notification => notification.id == e.detail.id)) return;
            this.notifications.unshift(e.detail);
            Nav.onNotification(this.notifications.filter(n => n.status == 'pending'));
        });
    }

    async get (offset) {
        const data = await notificationService.get({ offset: offset || 0 });
        const filtered = data.filter(notification => !this.notifications.find(n => n.id === notification.id));
        this.notifications = filtered.concat(this.notifications);
        this.notifications = this.notifications.sort((a, b) => b.id - a.id);

        if (this.hasUnread()) Nav.onNotification(this.getUnread());
    }

    hasUnread () {
        return this.notifications.find(notification => notification.status == 'pending');
    }

    getUnread () {
        return this.notifications.filter(notification => notification.status == 'pending');
    }

    read () {
        this.notifications.forEach(notification => notification.status = 'seen');
    };

    getNotifications () {
        return this.notifications;
    }

    clear () {
        this.notifications = [];
    }
}

export default new Notifier();