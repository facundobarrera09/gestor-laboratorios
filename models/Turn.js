const orm = require('../utils/model'), Seq = orm.Seq()

module.exports = {
    model: {
        id: {
            type: Seq.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        beginsAt: {
            type: Seq.DATE(6),
            allowNull: false
        },
        endsAt: {
            type: Seq.DATE(6),
            allowNull: false
        },
        accessingUserId: {
            type: Seq.INTEGER
        },
        creatingUserId: {
            type: Seq.INTEGER
        },
        laboratoryId: {
            type: Seq.INTEGER
        }
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
    }, {
        belongsTo: {
            model: 'Laboratory',
            options: {
                as: 'laboratory',
                foreignKey: {
                    name: 'laboratoryId',
                    allowNull: false
                }
            }
        }
    }]
}