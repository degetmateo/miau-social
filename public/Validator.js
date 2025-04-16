class Validator {
    constructor () {
        this.REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        this.REGEX_USERNAME = /^[a-zA-Z0-9_]+$/;
    }

    Email (value) {
        if (!value) return false;
        if (!value.trim()) return false;
        if (value.length > 128) return false;
        return this.REGEX_EMAIL.test(value);
    }

    Username (value) {
        if (!value) return false;
        if (value.length < 1 || value.length > 16) return false;
        return this.REGEX_USERNAME.test(value);
    }

    Name (value) {
        if (!value) return false;
        if (value.length < 1) return false;
        if (!value.trim()) return false;
        return true;
    }

    Password (value) {
        if (!value) return false;
        if (value.length < 8) return false;
        if (value.length > 128) return false;
        if (!value.trim()) return false;
        return true;
    }
}

export default new Validator();