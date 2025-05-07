import Service from "../modules/Service.js";

const get = async () => {
    try {
        return await Service.Fetch('/api/session', {
            method: "GET",
            credentials: "include"
        });
    } catch (error) {
        console.error(error);
        throw error;
    };
};

const close = async () => {
    try {
        return await Service.Fetch('/api/session', {
            method: "DELETE",
            credentials: "include"
        });
    } catch (error) {
        console.error(error);
        throw error;
    };
};

export const sessionService = {
    get,
    close
};