const path = require('path').join(__dirname, '../../../views');

// replace non-alphanumeric with empty string; replace spaces with dashes; lower case string and return
const toSlug = str => '/' + str.replace(/[^\w\s]/gi, '').replace(/\s+/g, '-').toLowerCase();

module.exports = (app, urlencodedParser, repo) => {
    app.get('/admin/content/form', (req, res) => {
        res.render(path + '/admin/pages/content-form.ejs', { title: 'Content Form' });
    });

    app.get('/admin/content', urlencodedParser, (req, res) => {
        res.render(path + '/admin/pages/content-list.ejs', { title: 'Content List' });
    });

    app.post('/admin/content', urlencodedParser, (req, res) => {
        console.log(req.body);
        const {
            type,
            category,
            title,
            content,
            description,
            meta_title,
            meta_description
        } = req.body;
        repo.create(type, category, 1, 1, title, toSlug(title), content, description, meta_title, meta_description)
        res.render(path + '/admin/pages/content-list.ejs', { title: 'Content List' });
    });
}