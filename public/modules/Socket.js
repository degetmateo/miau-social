import Alert from "../components/alert/alert.js";
import Service from "./Service.js";

class Socket {
    Initialize () {
        this.socket = io();
        this.on = this.socket.on;
        this.emit = this.socket.emit;
        window.app.socket = this.socket;

        this.socket.on('connect', () => {
            this.socket.emit('register', {
                token: localStorage.getItem('token')
            }, (response) => {
                this.Response(response, () => {
                    this.socket.emit('register', {
                        token: localStorage.getItem('token')
                    });
                });
            });
        });

        this.socket.on('socket-message', (data) => {
            window.dispatchEvent(new CustomEvent('socket-message', {
                detail: data
            }));
        });

        this.socket.on('socket-writing', (data) => {
            window.dispatchEvent(new CustomEvent('socket-writing', {
                detail: data
            }));
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

        this.socket.on('socket-new-post', (data) => {
            window.dispatchEvent(new CustomEvent('socket-new-post', {
                detail: data
            }));
        });

        this.EmitWriting = () => {
            this.socket.emit('socket-writing', {
                token: localStorage.getItem('token')
            }, (response) => {
                this.Response(response, () => {
                    this.socket.emit('socket-writing', {
                        token: localStorage.getItem('token')
                    });
                });
            });
        };

        this.EmitMessage = (e) => {
            this.socket.emit('socket-message', {
                token: localStorage.getItem('token'),
                content: e.detail.content
            }, (response) => {
                this.Response(response, () => {
                    this.socket.emit('socket-message', {
                        token: localStorage.getItem('token'),
                        content: e.detail.content
                    });
                });
            });
        };

        window.addEventListener('socket-emit-writing', this.EmitWriting);
        window.addEventListener('socket-emit-message', this.EmitMessage);
    };

    EmitMessage () {};

    EmitWriting () {};
    
    Response (response, func) {
        if (response.ok) return;

        if (response.status === 401) {
            return Service.Refresh({
                callback: () => {
                    func();
                }
            });
        } else {
            console.error(response.error);
            return new Alert(response.error.message, { error: true });
        };
    };

    Close () {
        try {
            if (this.socket) {
                this.socket.disconnect();
                this.socket = null;
                this.on = null;
                window.app.socket = null;
            };

            window.removeEventListener('socket-emit-writing', this.EmitWriting);
            window.removeEventListener('socket-emit-message', this.EmitMessage);
        } catch (error) {
            console.error(error);
        };
    };
};

export default new Socket();