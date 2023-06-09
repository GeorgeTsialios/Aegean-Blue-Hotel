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

    static async checkAuthentication(client, email, password) {
        try {
            const res = await client.query('select email,password from public.account where email = $1;', [email]);
            if (res.rows.length > 0) 
                return await bcrypt.compare(password, res.rows[0].password); 
                
            return  false;
        }
        catch (err) {
            console.error(err);
            console.log("-------------------------------");
        }
    }

    static async queryAccount(client, accountId) {
        try {
            const res = await client.query('select * from public.account a left join public.photo p on a.photo_source = p.source join public.account_level al on a.account_level = al.name where email = $1;', [accountId]);

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
                (res.rows[0].photo_source) ? new Photo(res.rows[0].source, res.rows[0].description) : null,
                new AccountLevel(res.rows[0].name, parseFloat(res.rows[0].discount), parseInt(res.rows[0].max_completed_bookings))
            );
        }
        catch (err) {
            console.error(err);
            console.log("-------------------------------");
        }
    }

    static async queryAccounts(client) {
        try {
            const res = await client.query('select first_name, last_name, email, is_administrator from public.account;');

            const accounts = [];

            for (let row of res.rows) {
                accounts.push(new Account(
                    row.first_name,
                    row.last_name,
                    row.email,
                    null,
                    null,
                    row.is_administrator,
                    null,
                    null
                ));
            }

            return accounts;
        }
        catch (err) {
            console.error(err);
            console.log("-------------------------------");
        }
    }

    static async queryAccountCredentials(client, email, password) {
        try {
            const res = await client.query('select * from public.account where email = $1 and password = $2;', [email, password]);
            return res.rows.length > 0;
        }
        catch (err) {
            console.error(err);
            console.log("-------------------------------");
        }
    }

    static async createAccount(client, firstName, lastName, email, password) {
        try {
            await client.query(
                'insert into public.account values ($1, $2, $3, $4, $5, $6, $7, $8);',
                [firstName, lastName, email, null, await bcrypt.hash(password,10), false, null, "Loyalty level 0"]
            );
        }
        catch (err) {
            console.error(err);
            console.log("-------------------------------");
        }
    }

    async changeAccountInfo(client, newFirstName, newLastName, newPhoneNumber) {
        this.firstName = newFirstName;
        this.lastName = newLastName;
        this.phoneNumber = newPhoneNumber;

        try {
            await client.query(
                'update public.account set first_name = $1, last_name = $2, phone_number = $3 where email = $4;',
                [this.firstName, this.lastName, this.phoneNumber, this.email]
            );
        }
        catch (err) {
            console.error(err);
            console.log("-------------------------------");
        }
    }

    async changeEmail(client, newEmail) {
        
        try {
            await client.query(
                'update public.account set email = $1 where email = $2;',
                [newEmail, this.email]
            );
            this.email = newEmail;
        }
        catch (err) {
            console.error(err);
            console.log("-------------------------------");
        }
    }

    async changePassword(client, newPassword) {
        const hash = await bcrypt.hash(newPassword,10)
        this.password = hash;

        try {
            await client.query(
                'update public.account set password = $1 where email = $2;',
                [this.password, this.email]
            );
        }
        catch (err) {
            console.error(err);
            console.log("-------------------------------");
        }
    }

    async changeProfilePicture(client, newProfilePicture) {
        try {
            if (!this.photo) {
                await client.query(
                    `insert into public.photo values ($1, $2, 'profile');`,
                    [newProfilePicture.source, newProfilePicture.description]
                )
                await client.query(
                    'update public.account set photo_source = $1 where email = $2;',
                    [newProfilePicture.source, this.email]
                );
            }

            this.photo = newProfilePicture;
        }
        catch (err) {
            console.error(err);
            console.log("-------------------------------");
        }
    }

    async checkPassword(password) {
        return bcrypt.compare(password, this.password);
    }

    async changeAdminState(client) {
        this.isAdministrator = !this.isAdministrator;

        await client.query(
            'update public.account set is_administrator = $1 where email = $2;',
            [this.isAdministrator, this.email]
        );
    }
}

export { Account }