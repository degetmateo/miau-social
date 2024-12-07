class Manager {
    constructor () {
        this.popups = [];
    }

    clear = () => {
        for (const popup of this.popups) {
            popup.remove();
        }

        this.popups = [];
    }

    add = (e) => {
        this.popups.push(e);
    }

    remove = (e) => {
        this.popups = this.popups.filter(p => p != e);
    }
}

export default new Manager();