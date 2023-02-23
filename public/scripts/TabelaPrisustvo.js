let NacrtajTabelicuPrisustva = function (brojPredavanjaSedmicno = 0, brojVjezbiSedmicno = 0, bioPredavanja, bioVjezbi, aktivnaSedmica, trenutnaSedmica, uneseno, student, predmet) {

	let tablica = "";

	if (aktivnaSedmica != trenutnaSedmica) {
		tablica = tablica + "<td>" + ((bioPredavanja + bioVjezbi) / (brojPredavanjaSedmicno + brojVjezbiSedmicno)) * 100 + "%</td>";
		//console.log()
		return tablica;
	}

	tablica = tablica + "<td class=\"celija_boja\"><table class=\"tabela_bojenja\"><tr>";
	// dodavanje kolona za predavanje
	for (let k = 1; k <= brojPredavanjaSedmicno; k++) {
		tablica = tablica + "<td class=\"element\">P<br>" + k + "</td>"
	}
	// dodavanje kolona za vjezbe
	for (let k = 1; k <= brojVjezbiSedmicno; k++) {
		tablica = tablica + "<td class=\"element\">V<br>" + k + "</td>"
	}
	tablica = tablica + "</tr><tr id=\"prisustva\">";
	for (let k = 0; k < bioPredavanja; k++) {
		if (!uneseno) {
			tablica = tablica + "<td class=\"prisustvoListener nije_uneseno_predavanje\" id=\"" + student.ime + ":" + student.index + ":" + trenutnaSedmica + ":nup:" + k + "\"><div class=\"nije_uneseno\"></div></td>";
		} else {
			tablica = tablica + "<td class=\"prisustvoListener prisutan_predavanje\" id=\"" + student.ime + ":" + student.index + ":" + trenutnaSedmica + ":pp:" + k + "\"><div class=\"prisutan\"></div></td>";
		}
	}
	for (let k = 0; k < brojPredavanjaSedmicno - bioPredavanja; k++) {
		if (!uneseno) {
			tablica = tablica + "<td class=\"prisustvoListener nije_uneseno_predavanje\" id=\"" + student.ime + ":" + student.index + ":" + trenutnaSedmica + ":nup:" + k + "\"><div class=\"nije_uneseno\"></div></td>";
		} else {
			tablica = tablica + "<td class=\"prisustvoListener nije_prisutan_predavanje\" id=\"" + student.ime + ":" + student.index + ":" + trenutnaSedmica + ":npp:" + k + "\"><div class=\"nije_prisutan\"></div></td>";
		}
	}

	for (let k = 0; k < bioVjezbi; k++) {
		if (!uneseno) {
			tablica = tablica + "<td class=\"prisustvoListener nisu_unesene_vjezbe\" id=\"" + student.ime + ":" + student.index + ":" + trenutnaSedmica + ":nuv:" + k + "\"><div class=\"nije_uneseno\"></div></td>";
		} else {
			tablica = tablica + "<td class=\"prisustvoListener prisutan_vjezbe\" id=\"" + student.ime + ":" + student.index + ":" + trenutnaSedmica + ":pv:" + k + "\"><div class=\"prisutan\"></div></td>";
		}
	}
	for (let k = 0; k < brojVjezbiSedmicno - bioVjezbi; k++) {
		if (!uneseno) {
			tablica = tablica + "<td class=\"prisustvoListener nisu_unesene_vjezbe\" id=\"" + student.ime + ":" + student.index + ":" + trenutnaSedmica + ":nuv:" + k + "\"><div class=\"nije_uneseno\"></div></td>";
		} else {
			tablica = tablica + "<td class=\"prisustvoListener nije_prisutan_vjezbe\" id=\"" + student.ime + ":" + student.index + ":" + trenutnaSedmica + ":npv:" + k + "\"><div class=\"nije_prisutan\"></div></td>";
		}
	}
	tablica = tablica + "</tr></table></td>";

	return tablica;
}

let NacrtajCijeluTabelu = function (studenti, prisustva, podaci, aktivnaSedmica, kolkoSedmica) {
	let tabela = "<div id=\"podaci_o_predmetu\"><h1>Naziv predmeta: " + podaci.predmet + "</h1><h2>Ciklus: " + podaci.ciklus + "</h2><h2>Godina studija: " + podaci.godina_studija + "</h2><h3>Odsjek: " + podaci.odsjek + "</h3></div>";
	tabela = tabela + "<table class=\"velika_tabela\"><tr><th>Ime i<br>prezime</th><th>Index</th>";

	let rimskiBrojevi = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV"];

	// sad dodajem headere za kolone koje su aktivne
	for (let i = 0; i <= kolkoSedmica-1; i++) {
		tabela = tabela + "<th>" + rimskiBrojevi[i] + "</th>";
	}
	// header za kolonu viska u koju su appendane sve viska kolone
	// viska celije u redu su sastavljene na nacin da je sve jedna celija sirine broj_praznih_celija*30px 
	// ta sirina se ovdje u kodu moze promijenit
	// to se desava samo ako je vise od 1 prazne celije prazno
	let sirina = 30;
	if (kolkoSedmica < 14) {
		tabela = tabela + "<th width=\"" + (15 - kolkoSedmica) * sirina + "px\">" + rimskiBrojevi[kolkoSedmica] + "-" + rimskiBrojevi[14] + "</th></tr>";
	} else if (kolkoSedmica == 14) {
		tabela = tabela + "<th width=\"" + sirina + "px\">" + rimskiBrojevi[14] + "</th></tr>";
	}

	// ispis svih podataka za prisustvo od svih studenata za koje je upisano
	for (let i in studenti) {
		// dodajem ime i index
		tabela = tabela + "<tr><td>" + studenti[i].ime + "</td><td>" + studenti[i].index + "</td>"
		// dodajem prisustvo
		for (let j = 1; j <= kolkoSedmica; j++) {

			// pronalazim u prisustvu upisanu sedmicu za trenutnog studenta
			let naso = false;
			let a = 0;
			for (let k in prisustva) {

				if (prisustva[k].index == studenti[i].index && j == prisustva[k].sedmica) {
					naso = true;
					a = k;
				}
			}
			if (naso) {
				tabela = tabela + NacrtajTabelicuPrisustva(podaci.brojPredavanjaSedmicno, podaci.brojVjezbiSedmicno, prisustva[a].predavanja, prisustva[a].vjezbe, aktivnaSedmica, j, true, studenti[i]);
			} else {
				tabela = tabela + NacrtajTabelicuPrisustva(podaci.brojPredavanjaSedmicno, podaci.brojVjezbiSedmicno, 0, 0, aktivnaSedmica, j, false, studenti[i]);
			}
			
		}

		// kraj reda
		if (kolkoSedmica < 14) {
			tabela = tabela + "<td width=\"" + (15 - kolkoSedmica) * 40 + "px\"></td>";
		} else if (kolkoSedmica == 14) {
			tabela = tabela + "<td></td>";
		}
		
		tabela = tabela + "</tr>";
	}

	tabela = tabela + "</table>";

	// dugmici za naprijed i nazad sa ikonicama
	tabela = tabela + "<button onclick=\"prethodnaSedmica()\" id=\"dugme1\" class=\"fa-solid fa-arrow-left\"><p class=\"dugme_tekst\">Prethodna<br>sedmica</p></button>";
	tabela = tabela + "<button onclick=\"sljedecaSedmica()\" id=\"dugme2\" class=\"fa-solid fa-arrow-right\"><p class=\"dugme_tekst\">Sljedeca<br>sedmica</p></button>";

	return tabela;
}

let TabelaPrisustvo = function (divRef, podaci) {
	// privatni atributi modula
	//

	// postavljanje htmla unutar diva na pocetku
	divRef.innerHTML = "";

	var studenti = podaci.studenti;
	var prisustva = podaci.prisustva;
	var popunjeneSedmice = [];
	var kolkoSedmica = 0;

	// Podaci nisu validni ako:
	// Broj prisustva na predavanju vježbi je veći od broja predavanja/vježbi sedmično		ZAVRSENO
	// Broj prisustva je manji od nule	  ZAVRSENO
	// Isti student ima dva ili više unosa prisustva za istu sedmicu	ZAVRSENO
	// Postoje dva ili više studenata sa istim indeksom u listi studenata	ZAVRSENO
	// Postoji prisustvo za studenta koji nije u listi studenata	ZAVRSENO
	// Postoji sedmica, između dvije sedmice za koje je uneseno prisustvo bar jednom studentu, 
	// 						u kojoj nema unesenog prisustva. Npr. uneseno je prisustvo
	//                      za sedmice 1 i 3 ali nijedan student nema prisustvo za sedmicu 2	ZAVRSENO 


	// provjeravamo legalnost sedmica i da li je neki 
	// broj prisustva na vjezbama ili predavanju veci od dozvoljenog
	for (let i in prisustva) {
		if (prisustva[i].predavanja > podaci.brojPredavanjaSedmicno || prisustva[i].vjezbe > podaci.brojVjezbiSedmicno) {
			divRef.innerHTML = "<p class=\"greska\">Podaci o prisustvu nisu validni!</p>";
			console.log("1");
		}
		if (prisustva[i].predavanja < 0 || prisustva[i].vjezbe < 0) {
			divRef.innerHTML = "<p class=\"greska\">Podaci o prisustvu nisu validni!</p>";
			console.log("2");
		}
		let bila = false;
		for (let j in popunjeneSedmice) {
			if (popunjeneSedmice[j] == prisustva[i].sedmica) {
				bila = true;
			}
		}
		if (!bila) {
			popunjeneSedmice[kolkoSedmica] = prisustva[i].sedmica;
			kolkoSedmica++;
		}
	}

	// sortiram popunjene sedmice radi provjere da li ima neka prazna sedmica izmedju dvije popunjene jer to nije validno
	popunjeneSedmice.sort(function(a, b){return a - b});
	// console.log("Popunjene sedmice: " + popunjeneSedmice);
	for (let i = 0; i < kolkoSedmica; i++) {
		//console.log("clan: " + popunjeneSedmice[i]);
		if (i < kolkoSedmica - 1 && parseInt(popunjeneSedmice[i + 1]) - parseInt(popunjeneSedmice[i]) > 1) {
			divRef.innerHTML = "<p class=\"greska\">Podaci o prisustvu nisu validni!</p>";
			console.log("3");
		}
	}

	// provjeravamo da li neki student ima vise unosa za istu sedmicu sto je nevalidno
	// ili ako isti student postoji vise puta u listi studenata
	for (let i in studenti) {
		let kolko = 0;
		let upisaneSedmice = [];
		for (let j in prisustva) {
			if (studenti[i].index == prisustva[j].index) {
				for (let k in upisaneSedmice) {
					if (upisaneSedmice[k] == prisustva[j].sedmica) {
						divRef.innerHTML = "<p class=\"greska\">Podaci o prisustvu nisu validni!</p>";
						console.log("4");
					}
				}
				if (divRef.innerHTML != "<p class=\"greska\">Podaci o prisustvu nisu validni!</p>") {
					upisaneSedmice[kolko] = prisustva[j].sedmica;
					kolko++;
				}
			}
		}
		for (let j in studenti) {
			if (studenti[i].index == studenti[j].index && i != j) {
				divRef.innerHTML = "<p class=\"greska\">Podaci o prisustvu nisu validni!</p>";
				console.log("5");
			}
		}
	}

	// provjeravamo da li je uneseno prisustvo za studenta koji ne postoji
	for (let i in prisustva) {
		let bio = false;
		for (let j in studenti) {
			if (prisustva[i].index == studenti[j].index) {
				bio = true;
			}
		}
		if (!bio) {
			divRef.innerHTML = "<p class=\"greska\">Podaci o prisustvu nisu validni!</p>";
			console.log("6");
		}
	}

	var sveOk = true;
	if (divRef.innerHTML == "<p class=\"greska\">Podaci o prisustvu nisu validni!</p>") {
		sveOk = false;
	}

	var aktivnaSedmica = kolkoSedmica;

	if (sveOk) {
		divRef.innerHTML = NacrtajCijeluTabelu(studenti, prisustva, podaci, aktivnaSedmica, kolkoSedmica);
	}

	// implementacija metoda
	let sljedecaSedmica = function () {
		if (aktivnaSedmica != kolkoSedmica) {
			aktivnaSedmica++;
			divRef.innerHTML = NacrtajCijeluTabelu(studenti, prisustva, podaci, aktivnaSedmica, kolkoSedmica);
		}
	}

	let prethodnaSedmica = function () {
		if (aktivnaSedmica != 1) {
			aktivnaSedmica--;
			divRef.innerHTML = NacrtajCijeluTabelu(studenti, prisustva, podaci, aktivnaSedmica, kolkoSedmica);
		}
	}

	return {
		sljedecaSedmica: sljedecaSedmica,
		prethodnaSedmica: prethodnaSedmica,
		aktivnaSedmica
	}
};