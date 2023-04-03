const orm = require('../utils/model'), Seq = orm.Seq()

module.exports = {
    model: {
        id: {
            type: Seq.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: Seq.STRING,
            allowNull: false
        },
        password: {
            type: Seq.STRING,
            allowNull: false
        }
    }
}