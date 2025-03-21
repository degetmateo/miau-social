class EventsHandler {
    constructor () {
        this.observers = new Array();
        this.onVisibilityChange();
        this.onKeyDown();
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

    onVisibilityChange () {
        document.onvisibilitychange = () => {
            for (const observer of this.observers) {
                observer.onVisibilityChange();
            }
        }
    }

    onKeyDown () {
        document.onkeydown = (e) => {
            if (e.code === 'Escape') {
                for (const observer of this.observers) {
                    observer.onEscape();
                }
            }

            if (e.code === 'Enter') {
                for (const observer of this.observers) {
                    observer.onEnter();
                }
            }
        }
    }
}

export default new EventsHandler();