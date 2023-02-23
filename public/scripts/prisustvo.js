let div = document.getElementById("divSadrzaj");
// instanciranje
let prisustvo = TabelaPrisustvo(div, {
                                        studenti: [
                                            {
                                                ime: "Neko Nekic",
                                                index: 12345
                                            },
                                            {
                                                ime: "Neko Nekic",
                                                index: 12346}], 
                                        prisustva:[
                                            {   
                                                sedmica: 1,
                                                predavanja: 2,
                                                vjezbe: 1,
                                                index: 12346
                                            },
                                            {   
                                                sedmica: 2,
                                                predavanja: 1,
                                                vjezbe: 1,
                                                index: 12345
                                            },
                                            {   
                                                sedmica: 3,
                                                predavanja: 1,
                                                vjezbe: 1,
                                                index: 12345
                                            },
                                            {   
                                                sedmica: 4,
                                                predavanja: 2,
                                                vjezbe: 1,
                                                index: 12346
                                            },
                                            {   
                                                sedmica: 5,
                                                predavanja: 1,
                                                vjezbe: 1,
                                                index: 12345
                                            },
                                            {   
                                                sedmica: 6,
                                                predavanja: 1,
                                                vjezbe: 1,
                                                index: 12345
                                            },
                                            {   
                                                sedmica: 7,
                                                predavanja: 2,
                                                vjezbe: 1,
                                                index: 12346
                                            },
                                            {   
                                                sedmica: 8,
                                                predavanja: 1,
                                                vjezbe: 1,
                                                index: 12345
                                            },
                                            {   
                                                sedmica: 9,
                                                predavanja: 1,
                                                vjezbe: 1,
                                                index: 12345
                                            },
                                            {   
                                                sedmica: 10,
                                                predavanja: 2,
                                                vjezbe: 1,
                                                index: 12346
                                            }/*,
                                            {   
                                                sedmica: 11,
                                                predavanja: 1,
                                                vjezbe: 1,
                                                index: 12345
                                            },
                                            {   
                                                sedmica: 12,
                                                predavanja: 1,
                                                vjezbe: 1,
                                                index: 12345
                                            },
                                            {   
                                                sedmica: 13,
                                                predavanja: 1,
                                                vjezbe: 1,
                                                index: 12345
                                            },
                                            {   
                                                sedmica: 14,
                                                predavanja: 1,
                                                vjezbe: 1,
                                                index: 12345
                                            },
                                            {   
                                                sedmica: 15,
                                                predavanja: 3,
                                                vjezbe: 2,
                                                index: 12345
                                            }*/
                                        ], 
                                        predmet: "Web tehnologije", 
                                        brojPredavanjaSedmicno: 3, 
                                        brojVjezbiSedmicno: 2,
                                        ciklus: "BSc",
                                        godina_studija: 3,
                                        odsjek: "Racunarstvo i informatika"
                                    }
);

let sljedecaSedmica = function() {
    prisustvo.sljedecaSedmica();
}

let prethodnaSedmica = function() {
    prisustvo.prethodnaSedmica();
} 
