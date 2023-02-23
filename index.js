const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session');
const bcrypt = require('bcrypt');

const fs = require("fs");

const Sequelize = require("sequelize");
const sequelize = require("./database_connection/konekcija.js");

const studentiBaza = require("./database_connection/studenti.js")(sequelize);
const prisustvaBaza = require("./database_connection/prisustva.js")(sequelize);
const nastavniciBaza = require("./database_connection/nastavnici.js")(sequelize);
const predmetiBaza = require("./database_connection/predmeti.js")(sequelize);

app.use(express.static(__dirname + "/public/html"));
app.use(express.static(__dirname + "/public"))

// citanje iz json datoteka
const nastavniciUcitaniIzFajla = JSON.parse(fs.readFileSync('./data/nastavnici.json'));
const prisustvaUcitanaIzFajla = JSON.parse(fs.readFileSync('./data/prisustva.json'));

app.use(session({ secret: 'tajna', resave: true, saveUninitialized: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

sequelize.sync().then(async () => {
    let predmetiMapa = new Map();
    for (var i = 0; i < nastavniciUcitaniIzFajla.length; i++) {
        var username = nastavniciUcitaniIzFajla[i].nastavnik.username;
        var password = nastavniciUcitaniIzFajla[i].nastavnik.password_hash;
        if (!predmetiMapa.has(username)) predmetiMapa.set(username, nastavniciUcitaniIzFajla[i].predmeti);
        await nastavniciBaza.findOrCreate({
            where: {
                username: username,
            },
            defaults: {
                username: username,
                password_hash: password
            }
        });
    }

    for (prisustvo of prisustvaUcitanaIzFajla) {
        var naziv = prisustvo.predmet;
        var brojPredavanjaSedmicno = prisustvo.brojPredavanjaSedmicno;
        var brojVjezbiSedmicno = prisustvo.brojVjezbiSedmicno;
        var ciklus = prisustvo.ciklus;
        var godina_studija = prisustvo.godina_studija;
        var odsjek = prisustvo.odsjek;
        var nastavnik;
        for ([username, nazivPredmeta] of predmetiMapa) {
            if (nazivPredmeta == naziv) {
                nastavnik = username;
                break;
            }
        }
        await predmetiBaza.findOrCreate({
            where: {
                predmet: naziv
            },
            defaults: {
                predmet: naziv,
                brojPredavanjaSedmicno: brojPredavanjaSedmicno,
                brojVjezbiSedmicno: brojVjezbiSedmicno,
                nastavnik: nastavnik,
                ciklus: ciklus,
                godina_studija: godina_studija,
                odsjek: odsjek
            }
        });
        var studentiIzPrisustva = prisustvo.studenti;
        for (student of studentiIzPrisustva) {
            var ime = student.ime;
            var index = student.index;
            await studentiBaza.findOrCreate({
                where: {
                    index: index
                },
                defaults: {
                    ime: ime,
                    index: index
                }
            });
        }
        var prisustvaIzPrisustva = prisustvo.prisustva;
        for (prisutan of prisustvaIzPrisustva) {
            var predavanja = prisutan.predavanja;
            var vjezbe = prisutan.vjezbe;
            var indeks = prisutan.index;
            var sedmica = prisutan.sedmica;
            await prisustvaBaza.findOrCreate({
                where: {
                    predmet: naziv,
                    index: indeks,
                    sedmica: sedmica
                },
                defaults: {
                    predmet: naziv,
                    sedmica: sedmica,
                    predavanja: predavanja,
                    vjezbe: vjezbe,
                    index: indeks
                }
            });
        }
    }
});

// rjesavanje logina
app.post('/login(.html)?', async function (req, res) {
    var usrname = req.body['username'];
    var pwd = req.body['password'];
    var poruka = 'Neuspješna prijava';
    var nastavnik = await nastavniciBaza.findOne({ where: { username: usrname } });
    // console.log(nastavnik);
    if (nastavnik != null) {
        // jel sve ok
        if (await bcrypt.compare(pwd, nastavnik.toJSON().password_hash).then(res => { return res })) {
            poruka = 'Uspješna prijava';
            req.session.username = nastavnik.toJSON().username;
            req.session.predmeti = await predmetiBaza.findAll({ where: { nastavnik: usrname }, attributes: ['predmet'], raw: true });
            prisustva = new Array();
        }
    }

    res.send({ mess: poruka });
})

app.post('/logout', function (req, res) { req.session.username = null; req.session.predmeti = null; res.send(); });

app.get('/predmeti', function (req, res) { res.send({ predmeti: req.session.predmeti }); });

app.get('/predmet/:NAZIV', async function (req, res) {
    var povratni = await prisustvaBaza.findAll({where: {predmet: req.url.substring(10, req.url.length)}, raw: true});
    var prisustva = new Array();
    for (prisustvo of povratni) {
        var sedmica = prisustvo.sedmica;
        var predavanja = prisustvo.predavanja;
        var vjezbe = prisustvo.vjezbe;
        var index = prisustvo.index;
        prisustva.push({sedmica, predavanja, vjezbe, index});
    }
    // console.log(povratni);
    var studentiSvi = await studentiBaza.findAll({raw: true});
    var mapaStudenata = new Map();
    var studenti = new Array();
    for (prisustvo of povratni) 
        if (!mapaStudenata.has(prisustvo.index)) 
            mapaStudenata.set(prisustvo.index, prisustvo.sedmica);

    for ([index, bezveze] of mapaStudenata) 
        studenti.push(studentiSvi.find((student) => student.index == index));

    // console.log(studenti);

    var predmetiSvi = await predmetiBaza.findAll({raw: true});
    var predmetNazad = predmetiSvi.find((p) => p.predmet == req.url.substring(10, req.url.length));
    // console.log(predmetNazad);
    var p = predmetNazad.predmet;
    var bps = predmetNazad.brojPredavanjaSedmicno;
    var bvs = predmetNazad.brojVjezbiSedmicno;
    var ciklus = predmetNazad.ciklus;
    var gs = predmetNazad.godina_studija;
    var od = predmetNazad.odsjek;

    res.send({ predmet: { studenti: studenti, prisustva: prisustva, predmet: p, brojPredavanjaSedmicno: bps, brojVjezbiSedmicno: bvs, ciklus: ciklus, godina_studija: gs, odsjek: od } });
});

app.post('/prisustvo/predmet/:NAZIV/student/:index', async function (req, res) {
    var predmet = req.url.split('/')[3].substring(1, req.url.split('/')[3].length);
    var index = parseInt(req.url.split('/')[5].substring(1, req.url.split('/')[5].length));
    var sedmica = parseInt(req.body['sedmica']), predavanja = parseInt(req.body['predavanja']), vjezbe = parseInt(req.body['vjezbe']);
    // var jesamLiIzvrsioIzmjenu = false, naMjestu;
    var prisustvoo = await prisustvaBaza.findOrCreate({ where: {
                                                                    predmet: predmet, 
                                                                    index: index, 
                                                                    sedmica: sedmica
                                                                }, 
                                                                defaults: {
                                                                    predmet: predmet, 
                                                                    sedmica: sedmica, 
                                                                    predavanja: predavanja,
                                                                    vjezbe: vjezbe,
                                                                    index: index
                                                                }
                                                        });
    // console.log(prisustvoo[0]);
    if (prisustvoo == null) {
        // ako objekat ne posotji kreiram ga
        await prisustvaBaza.findOrCreate({
            where: {
                predmet: predmet,
                index: index,
                sedmica: sedmica
            },
            defaults: {
                predmet: predmet,
                sedmica: sedmica,
                predavanja: predavanja,
                vjezbe: vjezbe,
                index: index
            }
        });
    } else {
        // ako objekat postoji updateujem objekat
        prisustvoo[0].predavanja = predavanja;
        prisustvoo[0].vjezbe = vjezbe;
        await prisustvoo[0].save();
    }

    var povratni = await prisustvaBaza.findAll({where: {predmet: predmet}, raw: true});
    var prisustva = new Array();
    for (prisustvo of povratni) {
        var sedmica = prisustvo.sedmica;
        var predavanja = prisustvo.predavanja;
        var vjezbe = prisustvo.vjezbe;
        var index = prisustvo.index;
        prisustva.push({sedmica, predavanja, vjezbe, index});
    }
    // console.log(povratni);
    var studentiSvi = await studentiBaza.findAll({raw: true});
    var mapaStudenata = new Map();
    var studenti = new Array();
    for (prisustvo of povratni) 
        if (!mapaStudenata.has(prisustvo.index)) 
            mapaStudenata.set(prisustvo.index, prisustvo.sedmica);

    for ([index, bezveze] of mapaStudenata) 
        studenti.push(studentiSvi.find((student) => student.index == index));

    // console.log(studenti);

    var predmetiSvi = await predmetiBaza.findAll({raw: true});
    var predmetNazad = predmetiSvi.find((p) => p.predmet == predmet);
    // console.log(predmetNazad);
    var p = predmetNazad.predmet;
    var bps = predmetNazad.brojPredavanjaSedmicno;
    var bvs = predmetNazad.brojVjezbiSedmicno;
    var ciklus = predmetNazad.ciklus;
    var gs = predmetNazad.godina_studija;
    var od = predmetNazad.odsjek;
    // console.log(studenti);
    res.send({ prisustva: { studenti: studenti, prisustva: prisustva, predmet: p, brojPredavanjaSedmicno: bps, brojVjezbiSedmicno: bvs, ciklus: ciklus, godina_studija: gs, odsjek: od } });
});

// koristeno za hesiranje passworda
// bcrypt.hash('sifra2', 10, function(err, hash) {
//     hash šifre imate ovdje
//     console.log(hash);
//     sifra1 = $2b$10$7c7Vxam/OUqLni80tTMPp.5eLRE7ZM2uyYfk2zpwU2q7RpRZoZTre
//     sifra2 = $2b$10$RQ1SnWWgfAQ2Cam.SJiy5.PxNn0i1bUnZLYZEq0e80CY4rqR7zkgO
// });

app.listen(3000);