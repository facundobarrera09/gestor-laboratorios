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
        passwordHash: {
            type: Seq.STRING,
            set(valor) {
                this.setDataValue('passwordHash', valor)
            },
            allowNull: false
        }
    }
}