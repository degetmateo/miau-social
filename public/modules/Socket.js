import Service from "./Service.js";

class Socket {
    Initialize () {
        this.socket = io();
        this.on = this.socket.on;

        this.socket.on('connect', () => {
            this.socket.emit('register', localStorage.getItem('token'));
        });

        this.socket.on('messages', (messages) => {
            window.dispatchEvent(new CustomEvent('messages', {
                detail: messages
            }));
        });

        this.socket.on('chat-message', (message) => {
            window.dispatchEvent(new CustomEvent('chat-message', {
                detail: message
            }));
        });

        this.socket.on('writing', (data) => {
            window.dispatchEvent(new CustomEvent('writing', {
                detail: data
            }));
        });

        this.socket.on('unauthorized', (data) => {
            Service.Refresh({
                callback: async () => {
                    if (data.code === 'register') {
                        this.socket.emit('register', localStorage.getItem('token'));
                    };

                    if (data.code === 'message') {
                        this.socket.emit('chat-message', {
                            token: localStorage.getItem('token'),
                            content: data.content 
                        });
                    };
                }
            });
        });

        this.socket.on('socket-notification', (notification) => {
            window.dispatchEvent(new CustomEvent('socket-notification', {
                detail: notification
            }));
        });

        this.socket.on('socket-notification-deleted', (notification) => {
            window.dispatchEvent(new CustomEvent('socket-notification-deleted', {
                detail: notification
            }));
        });

        window.addEventListener('socket-emit-writing', (e) => {
            const data = e.detail;
            this.socket.emit('writing', data.token);
        });
        window.addEventListener('socket-emit-message', (e) => {
            const data = e.detail;
            this.socket.emit('chat-message', {
                token: data.token,
                content: data.content
            });
        });
    };

    Close () {
        try {
            if (this.socket) {
                this.socket.disconnect();
                this.socket = null;
                this.on = null;
            };

            window.removeEventListener('socket-emit-writing', (e) => {
                const data = e.detail;
                this.socket.emit('writing', data.token);
            });
            window.removeEventListener('socket-emit-message', (e) => {
                const data = e.detail;
                this.socket.emit('chat-message', {
                    token: data.token,
                    content: data.content
                });
            });
        } catch (error) {
            console.error(error);
        };
    };
};

export default new Socket();