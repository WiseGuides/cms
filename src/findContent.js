const Handlebars = require('handlebars');
const fs = require('fs-extra');

// our database abstraction
const repos = require('./repositories');

// remove beginning/trailing slash and file extension
const scrubPathname = s => s.replace(/^\/|\/$/g, '').replace(/\.[^/.]+$/, '');

// compile html/handlebars template/layout with properties
const compile = (source, properties = {}) => {
    const template = Handlebars.compile(source);
    return template(properties);
};

// convert attributes (json string) to properties and overwrite previous properties...
// order of overwriting properties: layout, content, plugin
const parseAndReplaceProperties = (attributes, properties = {}) => ({ ...properties, ...JSON.parse(attributes) })

// in case we don't have additional attributes, we need to send a set of fake ones
const resolveAttributes = attribs => attribs === '' || attribs === undefined || attribs === null ? '{"k":"v"}' : attribs;

module.exports = async (path = '/') => {
    let view = `/${scrubPathname(path)}`;

    let result = {
        status: 404,
        content: '404'
    };
    const layout = await fs.readFile('views/index.html', 'utf8');
    let data
    try {
        result.status = 200;
        data = await repos.content.getBySlug(view).catch(d => console.log(d));
        if (data === undefined) {
            data = await repos.content.getBySlug('/404');
        }
    } catch (err) {
        data = await repos.content.getBySlug('/404');
    }
    result.content = compile(layout, parseAndReplaceProperties(resolveAttributes(data.additional_attributes), { ...data }));
    return result;
}