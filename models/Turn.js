const orm = require('../utils/model'), Seq = orm.Seq()

module.exports = {
    model: {
        id: {
            type: Seq.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        accessingUserId: {
            type: Seq.INTEGER,
        },
        creatingUserId: {
            type: Seq.INTEGER
        },
    },
    relations: [{
        belongsTo: {
            model: 'User',
            options: {
                as: 'accessingUser',
                foreignKey: {
                    name: 'accessingUserId',
                    allowNull: false
                }
            }
        }
    }, {
        belongsTo: {
            model: 'User',
            options: {
                as: 'creatingUser',
                foreignKey: {
                    name: 'creatingUserId',
                    allowNull: false
                }
            }
        }
    }
    ]
}