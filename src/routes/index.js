const adminContentRoutes = require('./admin/content_routes');

module.exports = (app, repos, urlencodedParser) => {
    const { content } = repos;
    adminContentRoutes(app, urlencodedParser, content);
}