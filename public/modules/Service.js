import Alert from "../components/alert/alert.js";
import router from "../router.js";
import {authenticationService} from "../services/authenticationService.js";
import EventsHandler from "./EventsHandler.js";

class Service {
    Fetch = async (url, options = {}) => {
        options.headers = options.headers || {};
        options.headers["Authorization"] = `Bearer ${localStorage.getItem('token')}`;

        let request = await fetch(url, options);
        let response = await request.json();

        if (request.status === 401) {
            await this.Refresh({
                callback: async () => {
                    options.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
                    request = await fetch(url, options);
                    response = await request.json();
                }
            });
        };

        if (!request.ok) throw response.error;
        return response.data;
    };

    Refresh = async ({ callback } = {}) => {
        try {
            const request = await fetch('/api/authentication/refresh-token', {
                method: "POST",
                credentials: "include"
            });
    
            const response = await request.json();
            if (!request.ok) throw new Error(response.error.message);
    
            localStorage.setItem("token", response.data);
    
            if (typeof callback === "function") {
                return await callback();
            }
        } catch (error) {
            console.error("Error al refrescar token:", error);
            localStorage.removeItem("token");
            window.app.logged = false;
            window.app = {};
            router.navigateTo("/signin");
            EventsHandler.clear();
            router.reset();
            new Alert("La sesión expiró, por favor vuelve a iniciar sesión.", { error: true });
            try {
                authenticationService.logout();
            } catch (error) {
                console.error(error);                
            }
        }
    };

    API = '/api/post'

    get = async ({
        mode = 'global',
        offset = 0,
        id_member = null
    }) => {
        try {
            const URL = mode === 'global' ? 
                `${this.API}?offset=${offset}&id_member=${id_member}` :
                `${this.API}/following?offset=${offset}`;

            const request = await fetch(URL, {
                method: 'GET',
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
            });

            const response = await request.json();
            if (!request.ok) throw new Error(response.error.message);
            
            return response;
        } catch (error) {
            console.error(error);
            new Alert(error.message);
        }
    }

    post = async ({
        content = '',
        images = []
    }) => {
        try {
            const request = await fetch (this.API, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'Content-Type': "Application/JSON"
                },
                body: JSON.stringify({ content, images })
            });
            
            const response = await request.json();
            if (!request.ok) throw new Error(response.error.message);

            return response;
        } catch (error) {
            console.error(error);
            new Alert(error.message);
        }
    }
}

export default new Service();