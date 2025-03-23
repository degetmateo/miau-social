import Alert from "./components/alert/alert.js";
import Navigation from "./components/navigation/navigation.js";
import Notifier from "./modules/Notifier.js";
import EventsHandler from "./modules/EventsHandler.js";
import router from "./router.js";

window.addEventListener("popstate", () => router.resolve());

document.addEventListener('DOMContentLoaded', async () => {
    document.body.addEventListener("click", (e) => {
        e.stopPropagation();
        const linkElement = e.target.closest("[data-link]");

        if (linkElement) {
            e.preventDefault();
            router.navigateTo(linkElement.href || linkElement.getAttribute('href'));
        }
    });

    const token = localStorage.getItem('token');

    if (!token) {
        localStorage.removeItem('token');
        router.navigateTo('/login');
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
        router.navigateTo('/login');
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
    EventsHandler.clear();

    window.app.nav = new Navigation();
    EventsHandler.addObserver(window.app.nav);
    
    EventsHandler.addObserver(Notifier);
    Notifier.initialize();
}