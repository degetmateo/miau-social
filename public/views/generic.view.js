export default class {
    constructor () {
        this.app = document.querySelector('#app');
        this.view = document.createElement('div');
        this.view.classList.add('view');
    };

    setTitle (title) {
        document.title = title;
    };

    clear () {
        this.app.innerHTML = '';
    };

    reset () {

    };

    async init () {};
};