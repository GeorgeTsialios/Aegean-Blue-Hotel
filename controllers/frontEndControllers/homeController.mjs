import { ApiControllers } from "../index.mjs";

function navigateToHome(req, res, next) {
    try {
        const account = ApiControllers.AccountController.returnAccount();
        const hotel = ApiControllers.HotelController.returnHotel();
        res.render(
            "home",
            {
                title: "Home",
                linkTags: `
                    <link rel="stylesheet" href="/css/home.css">
                    <script type="text/javascript" src="https://cdn.jsdelivr.net/jquery/latest/jquery.min.js"></script>
                    <script type="text/javascript" src="/js/moment.min.js"></script>
                    <script type="text/javascript" src="/js/daterangepicker.js"></script>
                    <link rel="stylesheet" type="text/css" href="/css/daterangepicker.css" />
                `,
                scriptTags: `
                    <script src="/js/home.js"></script>
                `,
                hotel: hotel,
                account: account
            }
        );
    }
    catch (err) {
        next(err);
    }
}

export { navigateToHome }