const get = async (data = {
    offset: 0
}) => {
    try {
        const request = await fetch(`/api/notification?offset=${data.offset}`, {
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

const read = async () => {
    try {
        const request = await fetch(`/api/notification/`, {
            method: "POST",
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

export const notificationService = {
    get,
    read
}