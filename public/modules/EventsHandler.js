class EventsHandler {
    constructor () {
        this.observers = new Array();
        this.onVisibilityChange();
        this.onKeyDown();
        this.onPathnameChange();
    }

    addObserver (observer) {
        this.removeObserver(observer);
        this.observers.push(observer);
    }

    removeObserver (observer) {
        this.observers = this.observers.filter(obs => !obs.isEqualTo(observer));
    }

    clear () {
        this.observers = new Array();
    }

    onNotification (unread) {
        for (const observer of this.observers) {
            if (observer.onNotification) observer.onNotification(unread);
        }
    }

    onVisibilityChange () {
        document.onvisibilitychange = () => {
            for (const observer of this.observers) {
                if (observer.onVisibilityChange) observer.onVisibilityChange();
            }
        }
    }

    onKeyDown () {
        document.onkeydown = (e) => {
            if (e.code === 'Escape') {
                for (const observer of this.observers) {
                    if (observer.onEscape) observer.onEscape();
                }
            }

            if (e.code === 'Enter') {
                for (const observer of this.observers) {
                    if (observer.onEnter) observer.onEnter();
                }
            }
        }
    }

    onPathnameChange () {
        window.addEventListener('pathnamechange', () => {
            for (const observer of this.observers) {
                if (observer.onPathnameChange) observer.onPathnameChange();
            }
        });

        window.onpopstate = () => {
            for (const observer of this.observers) {
                if (observer.onPathnameChange) observer.onPathnameChange();
            }
        };
    }
}

export default new EventsHandler();