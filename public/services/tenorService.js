const get = async (data = {
    args,
    pos
}) => {
    try {
        const request = await fetch(`/api/tenor?args=${data.args}${data.pos ? '&pos='+data.pos : ''}`, {
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

export const tenorService = {
    get
}