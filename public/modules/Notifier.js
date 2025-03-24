import Observer from "../interfaces/Observer.js";
import {notificationService} from "../services/notificationService.js";
import EventsHandler from "./EventsHandler.js";

class Notifier extends Observer {
    constructor () {
        super();
        this.notifications = [];
        this.cooldown = false;
        this.interval = null;
        this.observerId = 'notifier';
    }

    initialize () {
        this.interval = setInterval(() => {
            if (this.cooldown) return;
            this.get();
        }, 60000);
    }

    async get (offset) {
        const data = await notificationService.get({ offset: offset || 0 });
        const filtered = data.filter(notification => !this.notifications.find(n => n.id === notification.id));
        this.notifications = filtered.concat(this.notifications);
        this.notifications = this.notifications.sort((a, b) => b.id - a.id);

        if (this.hasUnread()) EventsHandler.onNotification(this.getUnread());
    }

    hasUnread () {
        return this.notifications.find(notification => notification.status === 'pending');
    }

    getUnread () {
        return this.notifications.filter(notification => notification.status === 'pending');
    }

    setRead () {
        this.notifications.forEach(notification => notification.status = 'seen');
    }

    getNotifications () {
        return this.notifications;
    }

    clear () {
        this.notifications = [];
    }

    activateCooldown () {
        this.cooldown = true;
        setTimeout(() => {
            this.cooldown = false;
        }, 60000);
    }

    onVisibilityChange () {
        this.get();
        this.activateCooldown();
    }
}

export default new Notifier();