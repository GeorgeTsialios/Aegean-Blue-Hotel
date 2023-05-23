
function navigateToBank(req, res, next) {
    try {
        
        res.render(
            "spinner1",
            {
                layout: "spinnerLayout",
                title: "Redirecting to Bank...",
                message: "Please wait while we redirect you to the bank environment...",
                linkTags:`<link rel="stylesheet" href="/css/spinner.css">`,
                scriptTags: `<script src="/js/spinner1.js"></script>`
            }
        );
        
    }
    catch (err) {
        next(err);
    }
}
 
export { navigateToBank } 
