import postgres from "postgres";

export default class Postgres {
    private static db: postgres.Sql<{}>;

    public static async init () {
        try {
            console.log('🟨 | Conectandose a la base de datos...');
            this.connect();
            await this.db`SELECT 1`;
            console.log('🟩 | Base de datos Postgres conectada.');
        } catch (error) {
            console.error('🟥 | Error: ', error);
            console.log('🟨 | Reintentando conexion a la base de datos en 10 segundos...');

            setTimeout(async () => {
                this.init();
            }, 10000);
        }
    }

    public static query (): postgres.Sql<{}> {
        return this.db;
    }

    private static connect () {
        this.db = postgres({
            host: process.env.POSTGRES_URL,
            port: Number(process.env.POSTGRES_PORT),
            database: process.env.POSTGRES_DB_NAME,
            username: process.env.POSTGRES_USERNAME,
            password: process.env.POSTGRES_PASSWORD,
            ssl: 'require'
        });
    }
}