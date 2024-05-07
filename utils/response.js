const { logRequest } = require("./logger");

module.exports = {
    sendErrorResponse: (err, req, res) => { 
        if (err.code) {
            if (err.code == 'ECONNREFUSED')
                err.code = 500;

            const response = {
                api_result: {
                    "code": err.code,
                    "message": err.message
                }
            };
            logRequest(req.originalUrl, response, req);
            return res.status(err.code).json(response);
        }

        // Dev handling error
        const errorCode = 400;
        const response = {
            api_result: {
                "code": errorCode,
                "message": err.message,
                "stack": err.stack
            }
        };

        logRequest(req.originalUrl, response, req);
        return res.status(errorCode).json(response);
    },

    sendSuccessfulResponse: (req, res, data, isLogged = false) => {
        const response = {
            api_result: {
                "code": 200,
                "data": data
            }
        };

        if (isLogged)
            logRequest(req.originalUrl, response, req);

        return res.status(200).json(response);
    },

    sendSuccessfulResponseApi: (req, res, data) => {
        const response = {
            api_result: {
                "code": 200,
                "data": data
            }
        };

        return res.status(200).json(response);
    },

    sendCustomErrorResponse: (res, code, message) => {
        const response = {
            api_result: {
                "code": code,
                "message": message
            }
        };
        logRequest(req.originalUrl, response);
        return res.status(code).json(response);
    },

    sendBadRequestResponse: (res) => {
        const response = {
            api_result: {
                "code": 400,
                "message": "Request body is empty"
            }
        };
        logRequest(req.originalUrl, response);
        return res.status(400).json(response);
    }
};
