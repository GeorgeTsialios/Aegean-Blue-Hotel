function navigateToLogin(req, res, next) {
    try {
        res.render(
            "login",
            {
                title: "Login",
                linkTags: `
                    <link rel="stylesheet" href="css/login.css">
                `,
                scriptTags: `
                    <script src = "js/login.js"></script>
                `
            }
        );
    }
    catch (err) {
        next(err);
    }
}

export { navigateToLogin }