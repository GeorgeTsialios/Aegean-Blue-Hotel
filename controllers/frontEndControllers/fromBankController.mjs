
function navigateFromBank(req, res, next) {
    try {
        
        res.render(
            "spinner1",
            {
                layout: "spinnerLayout",
                title: "Redirecting to Hotel Website...",
                message: "Payment successful! Returning to hotel website...",
                linkTags:`<link rel="stylesheet" href="/css/spinner.css">`,
                scriptTags: `<script src="/js/spinner2.js"></script>`
            }
        );
        
    }
    catch (err) {
        next(err);
    }
}

export { navigateFromBank } 
