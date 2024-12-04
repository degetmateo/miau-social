import bcrypt from 'bcrypt';

class Password {
    private readonly ROUNDS = 10;

    public async hash (password: string) {
        const salt = await bcrypt.genSalt(this.ROUNDS, "a");
        return await bcrypt.hash(password, salt);
    }

    public async compare (input: string, password: string) {
        return await bcrypt.compare(input, password);
    }
}

export default new Password();