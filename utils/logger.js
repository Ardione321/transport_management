var fs = require('fs');
var path = require('path').resolve(__dirname, '..');
var datetime = require('./datetime');

getDate = () => {
    const dateNow = new Date();
    let month = (1 + dateNow.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
    let day = dateNow.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return month + '-' + day + '-' + dateNow.getFullYear();
};

getTime = () => {
    return new Date().toLocaleTimeString('en-US', { hour12: false });
}

module.exports = {

    // NOTE: res is unused but kept in case we require to reject transaction if logging fails.
    logRequest: (action, res, req) => {
        try {
            const filename = path + '/logs/' + getDate() + '.txt';
            // let token;
            // if(req){
            //   token = req.get("authorization");
            // }

            let content = getTime() + ' | [INFO] : ' + action;
            if (req) {
                if (req.params && Object.keys(req.params).length > 0) {
                    content = content + ' \r\nparams: ' + JSON.stringify(req.params, null, '\t');
                }
                if (req.body && Object.keys(req.body).length > 0) {
                    content = content + ' \r\nbody: ' + JSON.stringify(req.body, null, '\t');
                }
            }
            if (res) {
                content = content + ' \r\nresponse: ' + JSON.stringify(res, null, '\t');
            }
            // if (token) {
            //   content = content + ' \r\ntoken: ' + token;
            // }
            content = content + '\r\n';
            fs.appendFile(filename, content, function (err) {
                if (err) throw err;
                // console.log('Saved!');
            });
        } catch (e) {
            console.log(e);
        }
    },

    logCacheInfo: (message) => {
        try {
            const filename = `${path}/logs/cache/${getDate()}.txt`;
            let content = `${getTime()} | [INFO]: ${message}\r\n`;
            fs.appendFile(filename, content, function (err) {
                if (err) throw err;
            });
            console.log(message);
        } catch (e) {
            console.log(e);
        }
    },

    logExternalApiMessage: (url, payloadString) => {
        try {
            const filename = path + '/logs/' + getDate() + '.txt';
            
            let formattedPayload;
            try {
                // Attempt to parse the payload as JSON
                const parsedPayload = JSON.parse(payloadString);
                formattedPayload = JSON.stringify(parsedPayload, null, 2);
            } catch (jsonError) {
                // If parsing fails, use the original payload string
                formattedPayload = payloadString;
            }
    
            let content = `${getTime()} | [API]: ${url} \r\n${formattedPayload}\r\n`;
            
            fs.appendFile(filename, content, function (err) {
                if (err) throw err;
            });
        } catch (e) {
            console.log(e);
        }
    }
};
