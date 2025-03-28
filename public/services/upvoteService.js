const upvote = async (data = {
    id
}) => {
    try {
        const request = await fetch(`/api/upvote`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('token'),
                "Content-Type": "Application/JSON"
            },
            body: JSON.stringify({
                id_post: data.id
            })
        });

        const response = await request.json();
        if (!request.ok) throw new Error(response.error.message);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const downvote = async (data = {
    id
}) => {
    try {
        const request = await fetch(`/api/upvote`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('token'),
                "Content-Type": "Application/JSON"
            },
            body: JSON.stringify({
                id_post: data.id
            })
        });

        const response = await request.json();
        if (!request.ok) throw new Error(response.error.message);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const upvoteService = {
    upvote,
    downvote
}