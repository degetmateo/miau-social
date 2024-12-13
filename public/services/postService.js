const get = async ({
    username,
    offset
}) => {
    try {
        const request = await fetch(`/api/post?username=${username}&offset=${offset}`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('token')
            }
        });

        const response = await request.json();
        if (!request.ok) throw new Error(response.error.message);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const postService = {
    get
}