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

                window.dispatchEvent(new CustomEvent('socket-messages', {
                    detail: {
                        messages: response.data.messages
                    }
                }));
            });
        });

        this.socket.on('socket-connections', (data) => {
            window.app.memberCount = data.memberCount;
            window.dispatchEvent(new CustomEvent('socket-connections', {
                detail: {
                    memberCount: data.memberCount
                }
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

        this.socket.on('socket-message', (data) => {
            window.dispatchEvent(new CustomEvent('socket-message', {
                detail: data
            }));
        });
    };

    Emission (event, data) {
        return new Promise((resolve) => {
            this.socket.emit(event, {
                token: localStorage.getItem('token'),
                ...data
            }, (response) => {
                resolve(response);
            });
        });
    };

    async Emit (event, data) {
        let response = { ok: false, error: { message: 'Error.' } };
        
        try {
            response = await this.Emission(event, data);
            
            if (!response.ok && response.status === 401) {
                await this.RefreshToken();
                response = await this.Emission(event, data);
            };
        } catch (error) {
            console.error(error);
            response.ok = false;
            response.error = error;
        };

        return response;
    };

    async RefreshToken () {
        const request = await fetch('/api/authentication/refresh-token', {
            method: "POST",
            credentials: "include"
        });

        const response = await request.json();
        if (!response.ok) throw new Error(response.error.message);

        localStorage.setItem("token", response.data);
    };

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
        } catch (error) {
            console.error(error);
        };
    };
};

export default new Socket();