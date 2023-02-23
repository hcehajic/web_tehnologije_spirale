const Sequelize = require("sequelize");
const sequelize = require("./konekcija.js");


module.exports = function (sequelize, DataTypes){
    
    const Studenti = sequelize.define("Studenti", {
        ime: Sequelize.STRING,
        index: Sequelize.INTEGER
    },{
        tableName: "Studenti"
    });

    return Studenti;
};