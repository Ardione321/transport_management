const APP_ENV = {
    local: 'local',
    development: 'dev',
    staging: 'staging',
    production: 'prod'
};

module.exports = {

    APP_ENV: APP_ENV,
    PAGINATION_PAGE_LIMIT: 10,

    // Sets payload to body from request query.
    // Used only in GET method.
    // This is to avoid empty payload when requesting via AJAX.
    // For improvement - workaround.
    setBodyFromQuery: (req) => {
        if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
            req.body = req.query;
        }
    },

    sanitizeData: (data) => {
        for (let key in data) {
            if (data[key] == null
                || data[key] === undefined
                || typeof data[key] !== 'string'
                || (!data[key] instanceof String))
                continue;

            data[key] = data[key].replace(/(\n|\r|[^a-zA-Z0-9@+#,/:.()-])/g, " ");
        }

        return data;
    },

    // Convert list to dictionary.
    toHashMap: (list, lambda) => {
        if (!list || list == null)
            return new Map();
        return new Map(list.map(lambda));
    },

    // Convert dictionary to list.
    toList: (dict) => {
        if (!dict || dict == null)
            return [];

        return Array.from(dict.values());
    },
};