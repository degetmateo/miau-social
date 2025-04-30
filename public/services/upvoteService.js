import Service from "../modules/Service.js";

const upvote = async (data = {
    id
}) => {
    try {
        return await Service.Fetch('/api/upvote', {
            method: 'POST',
            headers: {
                "Content-Type": "Application/JSON"
            },
            body: JSON.stringify({
                id_post: data.id
            })
        });
    } catch (error) {
        console.error(error);
        throw error;
    };
};

const downvote = async (data = {
    id
}) => {
    try {
        return await Service.Fetch('/api/upvote', {
            method: 'DELETE',
            headers: {
                "Content-Type": "Application/JSON"
            },
            body: JSON.stringify({
                id_post: data.id
            })
        });
    } catch (error) {
        console.error(error);
        throw error;
    };
};

export const upvoteService = {
    upvote,
    downvote
};