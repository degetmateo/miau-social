import Service from "../modules/Service.js";

const get = async (data = {
    offset: 0
}) => {
    try {
        return await Service.Fetch(`/api/notification?offset=${data.offset}`, {
            method: "GET",
        });
    } catch (error) {
        console.error(error);
        throw error;
    };
};

const read = async () => {
    try {
        return await Service.Fetch(`/api/notification/`, {
            method: "POST",
        });
    } catch (error) {
        console.error(error);
        throw error;
    };
};

export const notificationService = {
    get,
    read
};