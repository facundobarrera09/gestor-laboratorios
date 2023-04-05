const config = require('../utils/config')
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
            allowNull: false,
            validate: {
                respectsTurnDuration(value) {
                    const difference = ((value - this.beginsAt)/(60*1000))
                    if (!(difference === config.TURN_DURATION)) {
                        throw new Error(`begin date and end date do not represent stablished turn duration (${config.TURN_DURATION})`)
                    }
                }
            }
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