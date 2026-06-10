import Service from "../modules/Service.js";

const get = async (data = {
    username,
    type,
    olderId
}) => {
    try {
        const res = await Service.Fetch(`/api/follow/?username=${data.username}&type=${data.type}${data.olderId ? '&older_id='+data.olderId : ''}`, {
            method: "GET"
        });
        return res;
    } catch (error) {
        console.error(error);
        throw error;
    };
};

const follow = async (data = {
    id
}) => {
    try {
        return await Service.Fetch('/api/follow/member/' + data.id, {
            method: "POST"
        });
    } catch (error) {
        console.error(error);
        throw error;
    };
};

const unfollow = async (data ={
    id
}) => {
    try {
        return await Service.Fetch('/api/follow/member/' + data.id, {
            method: "DELETE"
        });
    } catch (error) {
        console.error(error);
        throw error;
    };
};

export const followService = {
    get,
    follow,
    unfollow
};