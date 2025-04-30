import Service from "../modules/Service.js";

const get = async (data = {
    username,
    offset
}) => {
    try {
        return await Service.Fetch(`/api/post?${data.username ? 'username='+data.username : ''}&offset=${data.offset}`, {
            method: "GET",
        });
    } catch (error) {
        console.error(error);
        throw error;
    };
};

const getFollowing = async (data = {
    offset: 0
}) => {
    try {
        return await Service.Fetch(`/api/post/following?offset=${data.offset}`, {
            method: "GET",
        });
    } catch (error) {
        console.error(error);
        throw error;
    };
};

const post = async (data = {
    content,
    images,
    type,
    target_id
}) => {
    try {
        const form = new FormData();

        form.append('content', data.content);
        form.append('type', data.type);

        for (let i = 0; i < data.images.length; i++) {
            const image = data.images[i];

            if (image.type === 'user') {
                const blob = await fetch(image.src).then(r => r.blob());
                form.append('image-'+i, blob, `image-${i}.png`);
            } else {
                form.append('tenor-'+i, image.src);
            };
        };

        if (data.target_id) form.append('target_id', data.target_id);

        return await Service.Fetch(`/api/post`, {
            method: 'POST',
            body: form
        });
    } catch (error) {
        console.error(error);
        throw error;
    };
};

const getById = async (data = {
    id
}) => {
    try {
        return await Service.Fetch(`/api/post/`+data.id, {
            method: "GET"
        });
    } catch (error) {
        console.error(error);
        throw error;
    };
};

const getReplies = async (data = {
    id,
    offset: 0
}) => {
    try {
        return await Service.Fetch(`/api/post/${data.id}/replies?offset=${data.offset}`, {
            method: "GET"
        });
    } catch (error) {
        console.error(error);
        throw error;
    };
};

const getThread = async (data = {
    id,
    offset: 0
}) => {
    return await Service.Fetch(`/api/post/${data.id}/thread?offset=${data.offset}`, {
        method: "GET"
    });
};

const remove = async (data = {
    id
}) => {
    return await Service.Fetch(`/api/post/${data.id}`, {
        method: "DELETE"
    });
};

const removeAdmin = async (data = {
    id
}) => {
    return await Service.Fetch(`/api/post/${data.id}/admin`, {
        method: "DELETE"
    });
};

export const postService = {
    get,
    getFollowing,
    post,
    getById,
    getReplies,
    getThread,
    remove,
    removeAdmin
};