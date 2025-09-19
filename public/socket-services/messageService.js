import Socket from "../modules/Socket.js";

const send = async (data) => {
    return await Socket.Emit('socket-message', data);
};

export const messageService = {
    send
};