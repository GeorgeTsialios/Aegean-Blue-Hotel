import { ApiControllers } from "../index.mjs";

function navigateToLogin(req, res, next) {
    try {
        const account = ApiControllers.AccountController.returnAccount();
        const hotel = ApiControllers.HotelController.returnHotel();
        res.render(
            "login",
            {
                title: "Login",
                linkTags: `
                    <link rel="stylesheet" href="/css/login.css">
                `,
                scriptTags: `
                    <script src = "/js/login.js"></script>
                `,
                account: account,
                hotel: hotel
            }
        );
    }
    catch (err) {
        next(err);
    }
}

export { navigateToLogin }