class Component {
    constructor () {
        this.cooldown = false;
    }

    setCooldown = () => {
        this.cooldown = true;
        setTimeout(() => {
            this.cooldown = false;
        }, 30000);
    }

    css = (href) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    }
}

export default Component;