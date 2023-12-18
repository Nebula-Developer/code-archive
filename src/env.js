
module.exports = {
    production: process.env.NODE_ENV == "production",
    debug: process.env.APP_DEBUG == "true"
}
