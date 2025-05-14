import Service from "../modules/Service.js";

const share = async (data = {
    id: 0
}) => {
    try {
        return await Service.Fetch(`/api/share?id=${data.id}`, {
            method: "PUT"
        });
    } catch (error) {
        console.error(error);
        throw error;
    };
};

const unshare = async (data = {
    id: 0
}) => {
    try {
        return await Service.Fetch(`/api/share?id=${data.id}`, {
            method: "DELETE"
        });
    } catch (error) {
        console.error(error);
        throw error;
    };
};

export const shareService = {
    share,
    unshare
};