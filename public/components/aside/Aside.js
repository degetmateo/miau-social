class Aside {
    constructor () {
        this.css('/public/components/aside/styles/aside.css');
        this.container = document.createElement('div');
        this.container.classList.add('aside-container');

        this.message = document.createElement('p');
        this.message.classList.add('aside-message');
        this.message.innerHTML = `Cantidad de Miembros: 400`;

        this.container.appendChild(this.message);
    }

    node = () => {
        return this.container;
    }

    css = (href) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    }
}

export default new Aside();