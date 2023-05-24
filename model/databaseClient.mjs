import pkg from 'pg';
import dotenv from 'dotenv';

async function createConnection() {
    dotenv.config()
    const client = new pkg.Client({connectionString: process.env.DATABASE_URL});
    await client.connect();
    return client;
}

async function endConnection(client) {
    await client.end();
}

export { createConnection, endConnection }