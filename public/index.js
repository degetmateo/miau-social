import Alert from "./components/alert/alert.js";
import Navigation from "./components/navigation/navigation.js";
import Listener from "./modules/Listener.js";
import Notifier from "./modules/Notifier.js";
import { navigateTo, router } from "./router.js";

window.addEventListener("popstate", () => router.resolve());

document.addEventListener('DOMContentLoaded', async () => {
    document.body.addEventListener("click", (e) => {
        e.stopPropagation();
        const linkElement = e.target.closest("[data-link]");

        if (linkElement) {
            e.preventDefault();
            navigateTo(linkElement.href || linkElement.getAttribute('href'));
        }
    });

    const token = localStorage.getItem('token');

    if (!token) {
        localStorage.removeItem('token');
        navigateTo('/login');
        return;
    }

    const request = await fetch ('/api/authentication/authenticate', {
        method: 'POST',
        headers: { "Authorization": `Bearer ${token}` }
    });
    
    const response = await request.json();

    if (!request.ok) {
        localStorage.removeItem('token');
        new Alert('La sesión expiró.', { error: true });
        navigateTo('/login');
        return;
    }

    localStorage.setItem('token', response.data.token);

    window.app = {};
    window.app.alerts = [];
    window.app.member = response.data;

    init();
    router.resolve();
});

export const init = () => {
    window.app.notifier = new Notifier();
    window.app.listener = new Listener();
    window.app.listener.addObserver(window.app.notifier);

    window.app.nav = new Navigation();
    window.app.notifier.addObserver(window.app.nav);
    window.app.notifier.init();
}