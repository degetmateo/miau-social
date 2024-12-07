import Alert from "./components/alert/alert.js";
import Navigation from "./components/navigation/navigation.js";
import Listener from "./modules/Listener.js";
import Notifier from "./modules/Notifier.js";
import { navigateTo, router } from "./router.js";

if (!localStorage.getItem('notifications')) localStorage.setItem('notifications', JSON.stringify({ last_id: 0 }));

window.addEventListener("popstate", () => router.resolve());

document.addEventListener('DOMContentLoaded', async () => {
    document.body.addEventListener("click", (e) => {
        e.stopPropagation();
        // if (e.target.matches("[data-link]") || e.target.hasAttribute('data-link')) {
        //     e.preventDefault();
        //     navigateTo(e.target.href || e.target.getAttribute('href'));
        // };

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
        new Alert(response.error.message);
        navigateTo('/login');
        return;
    }

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