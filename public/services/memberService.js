const getByUsername = async ({
    username
}) => {
    try {
        const request = await fetch(`/api/member/${username}`, {
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

export const memberService = {
    getByUsername
}