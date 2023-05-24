import { ApiControllers } from "../index.mjs";

async function navigateToLogin(req, res, next) {
    try {
        const account = await ApiControllers.AccountController.returnAccount("christoskatsandris@outlook.com");
        const hotel = await ApiControllers.HotelController.returnHotel();
        const roomTypes = await ApiControllers.RoomTypeController.returnRoomTypes();
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
                hotel: hotel,
                roomTypes: roomTypes
            }
        );
    }
    catch (err) {
        next(err);
    }
}

export { navigateToLogin }