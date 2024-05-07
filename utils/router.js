
module.exports = {

    // Get current date time.
    setBodyFromQuery: (req) => {
        if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
            req.body = req.query;
        }
    },
};