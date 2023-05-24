import { ApiControllers } from "../index.mjs";

async function navigateToHome(req, res, next) {
    try {
        const account = await ApiControllers.AccountController.returnAccount("christoskatsandris@outlook.com");
        const hotel = await ApiControllers.HotelController.returnHotel();
        const roomTypes = await ApiControllers.RoomTypeController.returnRoomTypes();
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
                account: account,
                roomTypes: roomTypes
            }
        );
    }
    catch (err) {
        next(err);
    }
}

export { navigateToHome }