import { ApiControllers } from "../index.mjs";
import * as DatabaseClient from "../../model/databaseClient.mjs";

Date.prototype.addDays = function (days) {
    const date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

async function navigateToSearchResults(req, res, next) {
    try {
        const client = await DatabaseClient.createConnection();
        const roomTypes = await ApiControllers.RoomTypeController.returnRoomTypes(client);
        const account = await ApiControllers.AccountController.returnAccount(client, req.session.accountId);
        const hotel = await ApiControllers.HotelController.returnHotel(client);
        await DatabaseClient.endConnection(client);
 
        const originalCheckInArray = req.query.checkInDate.split("/");
        originalCheckInArray.forEach((el,index,array) => { array[index] = Number(array[index]); });
         
        const originalCheckInDate = new Date(originalCheckInArray[2],originalCheckInArray[0]-1,originalCheckInArray[1]).toLocaleDateString("en-us", {"month": "short", "day": "numeric", "year": "numeric"});
        
  
        const originalCheckOutArray = req.query.checkOutDate.split("/");
        originalCheckOutArray.forEach((el,index,array) => { array[index] = Number(array[index]); }); 
        const originalCheckOutDate = new Date(originalCheckOutArray[2],originalCheckOutArray[0]-1,originalCheckOutArray[1]).toLocaleDateString("en-us", {"month": "short", "day": "numeric", "year": "numeric"});
     
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
                accountJSON: account ? JSON.stringify(account) : null,
                hotel: hotel,
                originalCheckInDate: originalCheckInDate,
                originalCheckOutDate: originalCheckOutDate,
                originalAdultsCount: originalAdultsCount,
                originalChildrenCount: originalChildrenCount,
                originalInfantsCount: originalInfantsCount,
                originalGuestsString: originalGuestsString,
                roomTypes: roomTypes,
                roomTypesJSON: JSON.stringify(roomTypes.map(roomType => [roomType, 0]))
            }
        );
    }
    catch (err) {
        next(err);
    }
}

export { navigateToSearchResults }