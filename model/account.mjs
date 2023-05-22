import pkg from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { AccountLevel } from './accountLevel.mjs';
import { Photo } from './photo.mjs';

class Account {
    constructor(firstName, lastName, email, phoneNumber, password, isAdministrator, photo, accountLevel) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.password = password;
        this.isAdministrator = isAdministrator;
        this.photo = photo;
        this.accountLevel = accountLevel;
    }

    static async queryAccount(accountId) {
        try {
            dotenv.config()
            const client = new pkg.Client({connectionString: process.env.DATABASE_URL});
            await client.connect();
            const res = await client.query('select * from public.account a join public.photo p on a.photo_source = p.source join public.account_level al on a.account_level = al.name where email = $1;', [accountId]);
            await client.end();

            if (res.rows.length === 0) {
                return null;
            }

            return new Account(
                res.rows[0].first_name,
                res.rows[0].last_name,
                res.rows[0].email,
                res.rows[0].phone_number,
                res.rows[0].password,
                res.rows[0].is_administrator,
                (res.rows[0].photo) ? new Photo(res.rows[0].source, res.rows[0].description) : null,
                new AccountLevel(res.rows[0].name, parseFloat(res.rows[0].discount), parseInt(res.rows[0].max_completed_bookings))
            );
        }
        catch (err) {
            console.error(err);
            console.log("-------------------------------");
        }
    }

    async createAccount() {
        try {
            dotenv.config()
            const client = new pkg.Client({connectionString: process.env.DATABASE_URL});
            await client.connect();
            await client.query(
                'insert into public.account values ($1, $2, $3, $4, $5, $6, $7, $8);',
                [this.firstName, this.lastName, this.email, this.phoneNumber, this.password, this.isAdministrator, this.photo.source, this.accountLevel.name]
            );
            await client.end();
        }
        catch (err) {
            console.error(err);
            console.log("-------------------------------");
        }
    }

    async changeAccountInfo(newFirstName, newLastName, newPhoneNumber) {
        this.firstName = newFirstName;
        this.lastName = newLastName;
        this.phoneNumber = newPhoneNumber;

        try {
            dotenv.config()
            const client = new pkg.Client({connectionString: process.env.DATABASE_URL});
            await client.connect();
            await client.query(
                'update public.account set first_name = $1, last_name = $2, phone_number = $3 where email = $4;',
                [this.firstName, this.lastName, this.phoneNumber, this.email]
            );
            await client.end();
        }
        catch (err) {
            console.error(err);
            console.log("-------------------------------");
        }
    }

    async changeEmail(newEmail) {
        this.email = newEmail;

        try {
            dotenv.config()
            const client = new pkg.Client({connectionString: process.env.DATABASE_URL});
            await client.connect();
            await client.query(
                'update public.account set email = $1 where email = $2;',
                [this.email, this.email]
            );
            await client.end();
        }
        catch (err) {
            console.error(err);
            console.log("-------------------------------");
        }
    }

    async changePassword(newPassword) {
        this.password = newPassword;

        try {
            dotenv.config()
            const client = new pkg.Client({connectionString: process.env.DATABASE_URL});
            await client.connect();
            await client.query(
                'update public.account set password = $1 where email = $2;',
                [this.password, this.email]
            );
            await client.end();
        }
        catch (err) {
            console.error(err);
            console.log("-------------------------------");
        }
    }

    async changeProfilePicture(newProfilePicture) {
        this.photo = newProfilePicture;

        try {
            dotenv.config()
            const client = new pkg.Client({connectionString: process.env.DATABASE_URL});
            await client.connect();
            await client.query(
                'update public.account set photo = $1 where email = $2;',
                [this.photo.source, this.email]
            );
            await client.end();
        }
        catch (err) {
            console.error(err);
            console.log("-------------------------------");
        }
    }
}

export { Account }