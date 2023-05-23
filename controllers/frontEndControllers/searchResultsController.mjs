import { ApiControllers } from "../index.mjs";

Date.prototype.addDays = function (days) {
    const date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

async function navigateToSearchResults(req, res, next) {
    try {
        const roomTypes = await ApiControllers.RoomTypeController.returnRoomTypes();
        const account = await ApiControllers.AccountController.returnAccount("christoskatsandris@outlook.com");
        const hotel = await ApiControllers.HotelController.returnHotel();
        
        console.log(req.query.checkInDate); 
 
        const originalCheckInArray = req.query.checkInDate.split("/");
        originalCheckInArray.forEach((el,index,array) => { array[index] = Number(array[index]); });
        console.log(originalCheckInArray); 
        const originalCheckInDate = new Date(originalCheckInArray[2],originalCheckInArray[0]-1,originalCheckInArray[1]).toLocaleDateString("en-us", {"month": "short", "day": "numeric", "year": "numeric"});
        console.log(originalCheckInDate);
  
        const originalCheckOutArray = req.query.checkOutDate.split("/");
        originalCheckOutArray.forEach((el,index,array) => { array[index] = Number(array[index]); }); 
        const originalCheckOutDate = new Date(originalCheckOutArray[2],originalCheckOutArray[0]-1,originalCheckOutArray[1]).toLocaleDateString("en-us", {"month": "short", "day": "numeric", "year": "numeric"});
 
        // originalCheckInDate = req.query.checkInDate? new Date(originalCheckInDate.getFullYear(),originalCheckInDate.getMonth()+1,originalCheckInDate.getDate()): new Date().addDays(1).toLocaleDateString("en-us", {"month": "short", "day": "numeric", "year": "numeric"});
        // const originalCheckInDate = new Date(req.query.checkInDate).toLocaleDateString("en-us", {"month": "short", "day": "numeric", "year": "numeric"});
        // const originalCheckInDateString = `${originalCheckInDate.getFullYear()}-${originalCheckInDate.getMonth()+1}-${originalCheckInDate.getDate()}`;
        // // const originalCheckOutDate = req.query.checkOutDate? new Date(req.query.checkOutDate): new Date().addDays(2).toLocaleDateString("en-us", {"month": "short", "day": "numeric", "year": "numeric"});
        // const originalCheckOutDate = new Date(req.query.checkOutDate);
        // const originalCheckOutDateString = `${originalCheckOutDate.getFullYear()}-${originalCheckOutDate.getMonth()+1}-${originalCheckOutDate.getDate()}`;
        // console.log(originalCheckOutDateString);    
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