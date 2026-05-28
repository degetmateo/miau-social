import { Db, MongoClient } from "mongodb";

class MongoDB {
    private client: MongoClient;
    private db: Db;
    private starting: boolean;

    constructor () {
        this.starting = false;
    };

    async init () {
        if (this.starting) return;
        this.starting = true;
        
        try {
            this.client = new MongoClient(process.env.MONGODB_DATABASE_KEY);
            await this.client.connect();
            this.db = this.client.db(process.env.MONGODB_DATABASE_NAME);
            console.log('✅ | MongoDB connected.');
        } catch (error) {
            console.error('🟥 | MongoDB error: ', error);
        } finally {
            this.starting = false;
        };
    };

    query () {
        return this.db;
    };
};

export default new MongoDB();