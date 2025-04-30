class Validators {
    constructor () {
        this.REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        this.REGEX_USERNAME = /^[a-zA-Z0-9_]+$/;
    }

    Email (value) {
        if (!value) throw new Error('Tenés que escribir tu correo electrónico.');
        if (!value.trim()) throw new Error('Tenés que escribir tu correo electrónico.');
        if (value.length > 128) throw new Error('Tu correo electrónico es demasiado largo.');
        if (!this.REGEX_EMAIL.test(value)) throw new Error('Tu correo electrónico debe ser válido.');
    }

    Username (value) {
        if (!value || value.length < 1) throw new Error('Tenés que escribir tu nuevo nombre de usuario.');
        if (value.length > 16) throw new Error('Tu nombre de usuario debe tener como máximo 16 carácteres.');
        if (!this.REGEX_USERNAME.test(value)) throw new Error('Tu nombre de usuario solo puede contener letras, números y guiones bajos.');
    };

    Name (value) {
        if (!value) return false;
        if (value.length < 1) return false;
        if (!value.trim()) return false;
        return true;
    }

    Password (value) {
        if (!value) throw new Error('Tenés que escribir tu contraseña.');
        if (!value.trim()) throw new Error('Tenés que escribir tu contraseña.');
        if (value.length < 8) throw new Error('Tu contraseña debe tener 8 carácteres como mínimo.');
        if (value.length > 128) throw new Error('Tu contraseña debe tener 128 carácteres como máximo.');
    }
}

export default new Validators();