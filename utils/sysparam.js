const APP_ENV = {
    local: 'local',
    development: 'dev',
    staging: 'staging',
    production: 'prod'
}

module.exports = {

    APP_ENV: APP_ENV,

    isDevEnv: () => {
        return process.env.APP_ENV == APP_ENV.local
            || process.env.APP_ENV == APP_ENV.development;
    },
};