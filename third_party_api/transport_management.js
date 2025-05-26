const https = require("https");
const { APP_ENV } = require("../utils/apputil");
const logger = require("../utils/logger");
const loginUser = "/api/user/login";
const CONTENT_TYPE = "application/json";
const METHOD = "POST";

module.exports = {
  sendLogin: async (user) => {
    const data = loginData(user.username, user.password);
    return sendRequest(loginUser, data);
  },
};

function getBaseUrl() {
  switch (process.env.APP_ENV) {
    case APP_ENV.local:
    case APP_ENV.development:
    case APP_ENV.staging:
      return "https://transport-management-r02p.onrender.com";
    case APP_ENV.production:
      return "https://transport-management-r02p.onrender.com";
    default:
      return "";
  }
}

async function sendRequest(endpoint, data) {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${endpoint}`;

  const options = {
    method: METHOD,
    headers: {
      "Content-Type": CONTENT_TYPE,
    },
  };

  logger.logExternalApiMessage(url, data);

  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let responseData = "";

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        logger.logExternalApiMessage(url, responseData);
        resolve(responseData);
      });
    });

    req.on("error", (error) => {
      logger.logExternalApiMessage(url, error.message);
      reject(error.message);
    });

    // Convert JSON data to string before sending
    req.write(JSON.stringify(data));
    req.end();
  });
}

function loginData(username, password) {
  // Create a JSON object instead of a string
  let data = {
    username: username,
    password: password,
  };

  return data;
}
