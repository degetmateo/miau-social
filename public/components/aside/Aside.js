import Helper from "../../Helper.js";

Helper.ImportCSS('/public/components/aside/aside.css');

class Aside extends HTMLElement {
    constructor () {
        super();
        this.classList.add('aside');

        this.container = document.createElement('div');
        this.container.classList.add('aside-container');
        this.append(this.container);

        this.c = document.createElement('div');
        this.c.classList.add('aside-connections-container');
        this.container.append(this.c);

        this.members = document.createElement('span');
        this.members.textContent = 'Miembros en línea:';
        this.members.classList.add('aside-members');
        this.c.append(this.members);

        this.count = document.createElement('span');
        this.count.classList.add('aside-count');
        this.count.textContent = '0';
        this.c.append(this.count);

        window.addEventListener('socket-connections', (e) => {
            this.count.textContent = e.detail.memberCount || 1;
        });
    };
};

customElements.define('app-aside', Aside);
export default Aside;