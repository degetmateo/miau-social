const get = async ({
    username,
    type,
    offset
}) => {
    try {
        const request = await fetch(`/api/follow/?username=${username}&type=${type}&offset=${offset}`, {
            method: "GET",
            headers: { "Authorization": "Bearer " + localStorage.getItem('token') }
        });
        const response = await request.json();
        if (!request.ok) throw new Error(response.error.message);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const follow = async ({
    id
}) => {
    try {
        const request = await fetch('/api/follow/member/' + id, {
            method: "POST",
            headers: { "Authorization": "Bearer " + localStorage.getItem('token') }
        });
        const response = await request.json();
        if (!request.ok) throw new Error(response.error.message);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const unfollow = async ({
    id
}) => {
    try {
        const request = await fetch('/api/follow/member/' + id, {
            method: "DELETE",
            headers: { "Authorization": "Bearer " + localStorage.getItem('token') }
        });
        const response = await request.json();
        if (!request.ok) throw new Error(response.error.message);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const followService = {
    get,
    follow,
    unfollow
}