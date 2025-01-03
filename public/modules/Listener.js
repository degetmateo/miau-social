export default class Listener {
    constructor () {
        this.observers = new Array();
        this.events();
    }

    addObserver (observer) {
        this.observers.push(observer);
    }

    removeObserver (_id) {
        this.observers = this.observers.filter(observer => observer.observerId != _id);
    }

    events () {
        this.onVisibilityChange();
        this.onKeyDown();
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

    clear () {
        this.observers = new Array();
    }
}