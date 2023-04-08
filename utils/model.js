const logger = require('./logger')

var filesystem = require('fs')
var models = {}
var relationships = {}

var singleton = function singleton(){
    var Sequelize = require('sequelize')
    var sequelize = null
    var modelsPath = ''

    this.setup = function (path, database, username, password, obj){
        modelsPath = path

        if(arguments.length === 3){
            sequelize = new Sequelize(database, username)
        }
        else if(arguments.length === 4){
            sequelize = new Sequelize(database, username, password)
        }
        else if(arguments.length === 5){
            sequelize = new Sequelize(database, username, password, obj)
        }

        sequelize.authenticate()
            .then(() => {
                logger.info('Connected to database')
                init()
            })
    }

    this.model = function (name){
        return models[name]
    }

    this.Seq = function (){
        return Sequelize
    }

    function init() {
        filesystem.readdirSync(modelsPath).forEach(function(name){
            var object = require('.'+modelsPath + '/' + name)
            var options = object.options || {}
            var modelName = name.replace(/\.js$/i, '')
            models[modelName] = sequelize.define(modelName, object.model, options)
            if('relations' in object){
                relationships[modelName] = object.relations
            }
        })
        // relationships: {
        //     Turn: {
        //          belongsTo: {
        //              model: 'User',
        //              options: {}
        //          }
        //     }
        // }

        // relationships[Turn] = turns relations

        // name = Turn
        // relation = relations
        // relName = belongsTo

        for(var modelName in relationships){
            const relations = relationships[modelName]
            relations.forEach(relation => {
                for (const relName in relation) {
                    const relatedModel = relation[relName].model
                    const relationOptions = relation[relName].options
                    models[modelName][relName](models[relatedModel], relationOptions)
                }
            })
        }
    }

    if(singleton.caller !== singleton.getInstance){
        throw new Error('This object cannot be instanciated')
    }

    this.getSequelize = () => {
        return sequelize
    }

    this.authenticate = () => {
        return sequelize.authenticate()
    }
}

singleton.instance = null

singleton.getInstance = function(){
    if(this.instance === null){
        this.instance = new singleton()
    }
    return this.instance
}

module.exports = singleton.getInstance()
