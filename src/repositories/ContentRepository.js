class ContentRepository {
    constructor(dao) {
        this.dao = dao
        this.createTable();
    }

    createTable() {
        const sql = `
        CREATE TABLE IF NOT EXISTS content (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid BLOB DEFAULT (LOWER(HEX(RANDOMBLOB(16)))),
            parent_id INTEGER DEFAULT 0,
            type_id INTEGER NOT NULL,
            category_id INTEGER DEFAULT 0,
            layout_id INTEGER DEFAULT 0,
            created_by INTEGER NOT NULL,
            updated_by INTEGER NOT NULL,
            plugins TEXT,
            title VARCHAR(255) NOT NULL,
            slug VARCHAR(255) NOT NULL,
            content TEXT,
            description VARCHAR(255),
            image VARCHAR(255),
            meta_title VARCHAR(255),
            meta_description VARCHAR(255),
            additional_attributes TEXT,
            created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_on DATETIME DEFAULT CURRENT_TIMESTAMP,
            published_on DATETIME
        )`;
        return this.dao.run(sql)
            .then(() => this.dao.run(`CREATE UNIQUE INDEX IF NOT EXISTS content_uuid_idx ON content (uuid)`))
            .then(() => this.dao.run(`CREATE UNIQUE INDEX IF NOT EXISTS content_slug_idx ON content (slug)`));
    }

    // RETURNING 10 RECORDS FOR API TESTING
    getAll() {
        return this.dao.all(`SELECT uuid,parent_id,type_id,category_id,layout_id,created_by,updated_by,plugins,title,slug,content,description,image,meta_title,meta_description,additional_attributes,created_on,updated_on,published_on FROM content LIMIT 10`);
    }

    get(id) {
        return this.dao.get(`SELECT uuid,parent_id,type_id,category_id,layout_id,created_by,updated_by,plugins,title,slug,content,description,image,meta_title,meta_description,additional_attributes,created_on,updated_on,published_on FROM content WHERE id = ?`, [id]);
    }

    getBySlug(slug) {
        return this.dao.get(`SELECT uuid,parent_id,type_id,category_id,layout_id,created_by,updated_by,plugins,title,slug,content,description,image,meta_title,meta_description,additional_attributes,created_on,updated_on,published_on FROM content WHERE slug = ?`, [slug]);
    }

    // create(uuid,parent_id,type_id,category_id,layout_id,created_by,updated_by,plugins,title,slug,content,description,image,meta_title,meta_description,additional_attributes,created_on,updated_on,published_on) {
    //     return this.dao.run(`
    //     INSERT INTO content (uuid,parent_id,type_id,category_id,layout_id,created_by,updated_by,plugins,title,slug,content,description,image,meta_title,meta_description,additional_attributes,created_on,updated_on,published_on)
    //     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    //     `, [uuid,parent_id,type_id,category_id,layout_id,created_by,updated_by,plugins,title,slug,content,description,image,meta_title,meta_description,additional_attributes,created_on,updated_on,published_on]);
    // }

    create(type_id, category_id, created_by, updated_by, title, slug, content, description, meta_title, meta_description) {
        return this.dao.run(`
        INSERT INTO content (type_id,category_id,created_by,updated_by,title,slug,content,description,meta_title,meta_description)
        VALUES (?,?,?,?,?,?,?,?,?,?)
        `, [type_id, category_id, created_by, updated_by, title, slug, content, description, meta_title, meta_description]);
    }

    update(id, uuid, parent_id, type_id, category_id, layout_id, created_by, updated_by, plugins, title, slug, content, description, image, meta_title, meta_description, additional_attributes, created_on, updated_on, published_on) {
        return this.dao.run(`
        UPDATE content
        SET
            uuid = ?,
            parent_id = ?,
            type_id = ?,
            category_id = ?,
            layout_id = ?,
            created_by = ?,
            updated_by = ?,
            plugins = ?,
            title = ?,
            slug = ?,
            content = ?,
            description = ?,
            image = ?,
            meta_title = ?,
            meta_description = ?,
            additional_attributes = ?,
            created_on = ?,
            updated_on = ?,
            published_on = ?
        WHERE id = ?
        `, [uuid, parent_id, type_id, category_id, layout_id, created_by, updated_by, plugins, title, slug, content, description, image, meta_title, meta_description, additional_attributes, created_on, updated_on, published_on, id])
    }

    delete(id) {
        return this.dao.run(`DELETE FROM content WHERE id = ?`, [id]);
    }

}

module.exports = ContentRepository