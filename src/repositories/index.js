const SqliteDAO = require('./SqliteDAO');

const DAO = new SqliteDAO('./database.sqlite3');
const ContentRepository = require('./ContentRepository');

module.exports = {
    content: new ContentRepository(DAO)
}