require('dotenv').config()

const PORT = process.env.PORT

const MYSQL_HOST = process.env.MYSQL_HOST

const DATABASE = (process.env.NODE_ENV === 'test') ? process.env.TEST_DATABASE : process.env.DATABASE

const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD

const SECRET = process.env.SECRET

module.exports = {
    PORT,
    MYSQL_HOST,
    DATABASE,
    DB_USER,
    DB_PASSWORD,
    SECRET
}