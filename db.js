const pgp = require("pg-promise")({});
const db = pgp("postgres://postgres:12345678@localhost:5432/crud_db");

module.exports = db;
