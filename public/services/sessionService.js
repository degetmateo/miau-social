import Service from "../modules/Service.js";

const get = async () => {
    try {
        return await Service.Fetch('/api/session', {
            method: "GET"
        });
    } catch (error) {
        console.error(error);
        throw error;
    };
};

export const sessionService = {
    get
};