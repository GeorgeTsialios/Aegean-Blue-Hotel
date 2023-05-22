import { ApiControllers } from "../index.mjs";

Date.prototype.addDays = function (days) {
    const date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

function navigateToSearchResults(req, res, next) {
    try {
        const roomTypes = await ApiControllers.RoomTypeController.returnRoomTypes();
        const account = await ApiControllers.AccountController.returnAccount("christoskatsandris@outlook.com");
        const hotel = await ApiControllers.HotelController.returnHotel();
        
        const originalAdultsCount = req.query.adultsCount? Number(req.query.adultsCount) :1;
        const originalChildrenCount = req.query.childrenCount? Number(req.query.childrenCount) :0;
        const originalInfantsCount = req.query.infantsCount? Number(req.query.infantsCount) :0;

        const originalGuestsString = `${originalAdultsCount} ${(originalAdultsCount === 1) ? "adult" : "adults"} • ${originalChildrenCount} ${(originalChildrenCount === 1) ? "child" : "children"} • ${originalInfantsCount} ${(originalInfantsCount === 1) ? "infant" : "infants"}`;
        
        res.render(
            "searchResults",
            {
                title: "Search Results",
                linkTags: `
                    <link rel="stylesheet" href="/css/search_results.css">
                    <link rel="stylesheet" type="text/css" href="/css/daterangepicker.css">
                `,
                scriptTags: `
                    <script type="text/javascript" src="https://cdn.jsdelivr.net/jquery/latest/jquery.min.js"></script>
                    <script type="text/javascript" src="/js/moment.min.js"></script>
                    <script type="text/javascript" src="/js/daterangepicker.js"></script>
                    <script src = "/js/search_results.js"></script>
                `,
                account: account,
                hotel: hotel,
                originalCheckInDate: originalCheckInDate,
                originalCheckOutDate: originalCheckOutDate,
                originalAdultsCount: originalAdultsCount,
                originalChildrenCount: originalChildrenCount,
                originalInfantsCount: originalInfantsCount,
                originalGuestsString: originalGuestsString,
                roomTypes: roomTypes
            }
        );
    }
    catch (err) {
        next(err);
    }
}

export { navigateToSearchResults }