const Sequelize = require("sequelize");
const sequelize = require("./konekcija.js");


module.exports = function (sequelize, DataTypes){
    
    const Nastavnici = sequelize.define("Nastavnici", {
        username: Sequelize.STRING,
        password_hash: Sequelize.STRING
    },{
        tableName: "Nastavnici"
    });

    return Nastavnici;
};