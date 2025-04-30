import Service from "../modules/Service.js";

const get = async (data = {
    args,
    pos
}) => {
    try {
        return await Service.Fetch(`/api/tenor?args=${data.args}${data.pos ? '&pos='+data.pos : ''}`, {
            method: 'GET'
        });
    } catch (error) {
        console.error(error);
        throw error;
    };
};

export const tenorService = {
    get
};