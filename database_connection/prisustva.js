const Sequelize = require("sequelize");
const sequelize = require("./konekcija.js");


module.exports = function (sequelize, DataTypes){
    
    const Prisustva = sequelize.define("Prisustva", {
        predmet: Sequelize.STRING,
        sedmica: Sequelize.INTEGER,
        predavanja: Sequelize.INTEGER,
        vjezbe: Sequelize.INTEGER,
        index: Sequelize.INTEGER
    },{
        tableName: "Prisustva"
    });

    return Prisustva;
};