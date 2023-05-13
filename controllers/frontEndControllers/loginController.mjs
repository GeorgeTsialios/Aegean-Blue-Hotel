import { Account } from "../../model/account.mjs";
import { AccountLevel } from "../../model/accountLevel.mjs";

const accountLevels = [
    new AccountLevel("Loyalty level 0", 0, 0),
    new AccountLevel("Loyalty level 1", 0.1, 3),
    new AccountLevel("Loyalty level 2", 0.2, 6),
    new AccountLevel("Loyalty level 3", 0.3, 10)
];

const account = new Account(
    "Christos",
    "Katsandris",
    "christoskatsandris@outlook.com",
    "+306937708141",
    "123456",
    true,
    null,
    // new Photo("assets/HotelPhotos/double2.jpg", "Deluxe Twin Room"),
    accountLevels[3]
);

function navigateToLogin(req, res, next) {
    try {
        res.render(
            "login",
            {
                title: "Login",
                linkTags: `
                    <link rel="stylesheet" href="css/login.css">
                `,
                scriptTags: `
                    <script src = "js/login.js"></script>
                `,
                account: account
            }
        );
    }
    catch (err) {
        next(err);
    }
}

export { navigateToLogin }