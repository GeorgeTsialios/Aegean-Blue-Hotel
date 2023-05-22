import pkg from 'pg';
import dotenv from 'dotenv';

class AccountLevel {
    constructor(name, discount, maxCompletedBookings) {
        this.name = name;
        this.discount = discount;
        this.maxCompletedBookings = maxCompletedBookings;
    }

    static async queryAccountLevels() {
        try {
            dotenv.config();
            const client = new pkg.Client({connectionString: process.env.DATABASE_URL});
            await client.connect();
            const res = await client.query('select * from public.account_level;');
            await client.end();

            const accountLevels = [];

            for (let row of res.rows) {
                accountLevels.push(
                    new AccountLevel(row.name, parseFloat(row.discount), parseInt(row.max_completed_bookings))
                );
            }

            return accountLevels;
        }
        catch (err) {
            console.error(err);
            console.log("-------------------------------");
        }
    }
}

export { AccountLevel }