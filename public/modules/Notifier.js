import Alert from "../components/alert/alert.js";

class Notifier {
    STORAGE = 'notifications';
    URL = '/api/notifications/';

    constructor () {
        this.entries = new Array();
        this.observers = new Array();

        this.observerId = 'notifier';
        this.cooldown = false;
    }

    clear () {
        this.entries = new Array();
        this.observers = new Array();
    }

    init () {
        this.do();
        this.interval = setInterval(() => {
            this.do();
        }, 60000);
    }

    async do () {
        const n = await this.fetch(0);
        this.insert(n);
        const unread = this.getUnread();
        if (unread.length >= 1) this.notifyObservers();
    }

    onVisibilityChange = () => {
        if (this.cooldown) return;
        this.do();
        this.cooldown = true;
        setTimeout(() => {
            this.cooldown = false;
        }, 60000);
    }

    notifyObservers () {
        this.observers.forEach(observer => {
            observer.onNotifications();
        });
    }

    addObserver (observer) {
        this.observers.push(observer);
    }

    removeObserver (_id) {
        this.observers = this.observers.filter(observer => observer.observerId != _id);
    }

    get () {
        return this.entries;
    }

    read = async () => {
        for (const n of this.entries) {
            n.status = 'seen';
        }
        const request = await fetch(`/api/notification`, {
            method: "POST",
            headers: { "Authorization": "Bearer " + localStorage.getItem('token') }
        });
        const response = await request.json();
        if (!request.ok) return new Alert(response.error.message);
    }

    async fetch (c) {
        const request = await fetch(`/api/notification?offset=${c}`, {
            method: "GET",
            headers: { "Authorization": "Bearer " + localStorage.getItem('token') }
        });
        const response = await request.json();
        if (!request.ok) return new Alert(response.error.message);
        return response.data;
    }

    getUnread () {
        const unread = this.get().filter(n => n.status === 'pending');
        return unread;
    }

    insert (_entries) {
        const entries = new Array();
        for (let e = 0; e < _entries.length; e++) {
            if (this.get().find(n => parseInt(n.id) === parseInt(_entries[e].id))) continue;
            entries.push(_entries[e]);
        }
        this.set([...entries, ...this.get()]);
    }

    insertAfter (_entries) {
        const entries = new Array();
        for (let e = 0; e < _entries.length; e++) {
            if (this.get().find(n => parseInt(n.id) === parseInt(_entries[e].id))) continue;
            entries.push(_entries[e]);
        }
        this.set([...this.get(), ...entries]);
    }

    has (_n) {
        return this.entries.find(n => n.id === _n.id) ? true : false;
    }

    delete (_n) {
        this.set(this.entries.filter(n => n.id != _n.id));
    }

    set (_entries) {
        this.entries = _entries;
    }
}

export default Notifier;