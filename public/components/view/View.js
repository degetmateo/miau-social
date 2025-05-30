class View extends HTMLElement {
    constructor () {
        super();
        this.classList.add('app-view');
    };
};

customElements.define('app-view', View);
export default View;