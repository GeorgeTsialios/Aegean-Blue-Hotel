import { RoomType } from "../../model/roomType.mjs";
import { Photo } from "../../model/photo.mjs";
import { ApiControllers } from "../index.mjs";

const originalCheckInDate = new Date(2023,4,31).toLocaleDateString("en-us", {"month": "short", "day": "numeric", "year": "numeric"})
const originalCheckOutDate = new Date(2023,5,2).toLocaleDateString("en-us", {"month": "short", "day": "numeric", "year": "numeric"})

const originalGuests = {
    "adultsCount": 4,
    "childrenCount": 3,
    "infantsCount": 0
}
const originalGuestsString = `${originalGuests['adultsCount']} ${(originalGuests['adultsCount'] === 1) ? "adult" : "adults"} • ${originalGuests['childrenCount']} ${(originalGuests['childrenCount'] === 1) ? "child" : "children"} • ${originalGuests['infantsCount']} ${(originalGuests['infantsCount'] === 1) ? "infant" : "infants"}`;

function navigateToSearchResults(req, res, next) {
    try {
        const roomTypes = ApiControllers.RoomTypeController.returnRoomTypes();
        const account = ApiControllers.AccountController.returnAccount();
        res.render(
            "searchResults",
            {
                title: "Search Results",
                linkTags: `
                    <link rel="stylesheet" href="css/search_results.css">
                    <script type="text/javascript" src="https://cdn.jsdelivr.net/jquery/latest/jquery.min.js"></script>
                    <script type="text/javascript" src="js/moment.min.js"></script>
                    <script type="text/javascript" src="js/daterangepicker.js"></script>
                    <link rel="stylesheet" type="text/css" href="css/daterangepicker.css">
                `,
                scriptTags: `
                    <script src = "js/search_results.js"></script>
                `,
                originalCheckInDate: originalCheckInDate,
                originalCheckOutDate: originalCheckOutDate,
                originalAdultsCount: originalGuests["adultsCount"],
                originalChildrenCount: originalGuests["childrenCount"],
                originalInfantsCount: originalGuests["infantsCount"],
                originalGuestsString: originalGuestsString,
                roomTypes: roomTypes,
                account: account
            }
        );
    }
    catch (err) {
        next(err);
    }
}

export { navigateToSearchResults }