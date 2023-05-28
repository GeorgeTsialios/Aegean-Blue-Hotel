class AccountLevel {
    constructor(name, discount, maxCompletedBookings) {
        this.name = name;
        this.discount = discount;
        this.maxCompletedBookings = maxCompletedBookings;
    }

    static async queryAccountLevels(client) {
        try {
            const res = await client.query('select * from public.account_level;');

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