const express = require('express');
const bodyParser = require("body-parser");
const { parse } = require('url');

const findContent = require('./src/findContent');

const app = express();

app.set('view engine', 'ejs');

app.use(express.static('static'));

// parse the body for params etc...
app.use(bodyParser.json());
// or...
// can create separate parsers (middleware) for json and post params
// for routes sending json objects...
// const jsonParser = bodyParser.json();

// for routes submitting post params
const urlencodedParser = bodyParser.urlencoded({ extended: true });

// require our database abstraction and assign to repos
const repos = require('./src/repositories');

// require all of our routes
// pass the express instance, jwt middleware, and our db abstraction
require('./src/routes/')(app, repos, urlencodedParser);

app.get('*', async (req, res) => {
    console.log('...');
    // destructure the request and extract pathname and query params
    const { pathname, query } = parse(req.url, true);
    // get the promise of findContent and return the data
    const result = await findContent(pathname).then(data => data);
    // display the status and the content returned from our findContent call
    res.status(result.status).send(result.content);
});

const server = app.listen(3000, () => {
    console.log('Example app is running → PORT 3000');
});
server.timoute = 1000;