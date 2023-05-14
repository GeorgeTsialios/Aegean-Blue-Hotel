function navigateToSearchResults(req, res, next) {
    try {
        res.render(
            "searchResults",
            {
                title: "Search Results",
                linkTags: `
                    <link rel="stylesheet" href="css/search_results.css">
                    <script type="text/javascript" src="https://cdn.jsdelivr.net/jquery/latest/jquery.min.js"></script>
                    <script type="text/javascript" src="js/moment.min.js"></script>
                    <script type="text/javascript" src="js/daterangepicker.js"></script>
                    <link rel="stylesheet" type="text/css" href="css/daterangepicker.css" />
                `,
                scriptTags: `
                    <script src = "js/search_results.js"></script>
                `
            }
        );
    }
    catch (err) {
        next(err);
    }
}

export { navigateToSearchResults }