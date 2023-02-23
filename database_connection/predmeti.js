const Sequelize = require("sequelize");
const sequelize = require("./konekcija.js");


module.exports = function (sequelize, DataTypes){
    
    const Predmeti = sequelize.define("Predmeti", {
        predmet: Sequelize.STRING,
        brojPredavanjaSedmicno: Sequelize.INTEGER,
        brojVjezbiSedmicno: Sequelize.INTEGER,
        nastavnik: Sequelize.STRING,
        ciklus: Sequelize.STRING,
        godina_studija: Sequelize.INTEGER,
        odsjek: Sequelize.STRING
    },{
        tableName: "Predmeti"
    });

    return Predmeti;
};