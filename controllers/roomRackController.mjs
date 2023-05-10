function navigateToRoomRack(req, res, next) {
    try {
        res.render(
            "roomRack",
            {
                title: "Room Rack",
                linkTags: `
                    <link rel="stylesheet" href="css/room_rack.css">
                `,
                scriptTags: `
                    <script src="js/room_rack.js"></script>
                `
            }
        );
    }
    catch (err) {
        next(err);
    }
}

export { navigateToRoomRack }