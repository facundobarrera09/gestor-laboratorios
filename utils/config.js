require('dotenv').config()

const NODE_ENV = process.env.NODE_ENV

const PORT = process.env.PORT

const MYSQL_HOST = process.env.MYSQL_HOST

const DATABASE = (NODE_ENV === 'test') ? process.env.TEST_DATABASE : process.env.DATABASE

const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD

const SECRET = process.env.SECRET

module.exports = {
    NODE_ENV,
    PORT,
    MYSQL_HOST,
    DATABASE,
    DB_USER,
    DB_PASSWORD,
    SECRET
}