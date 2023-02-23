let prethodnaSedmica, sljedecaSedmica, rez, klik = 1, trenutnaSedmica;

function nadjiTrenutnu(sedmica, index, data) {

    for (let prisustvo of data.prisustva) 
        if (prisustvo.sedmica == sedmica && prisustvo.index == index) 
            return prisustvo;
            
    return null;
}

function dodajListenereNaCelije(data) {

    var prisustvaListener = document.getElementsByClassName("prisustvoListener");
    for (let celija of prisustvaListener) {
        celija.addEventListener("click", function handleClick(event){    
            var sedm = celija.id.split(':')[2];
            var index = celija.id.split(":")[1];  
            var sta = celija.id.split(':')[3];
            var trenutna = nadjiTrenutnu(sedm, index, data);
                 if (sta == 'nup') PoziviAjax.postPrisustvo(data.predmet, index, {sedmica: sedm, predavanja: 1, vjezbe: 0}, nacrtajTabeluPredmeta);
            else if (sta == 'nuv') PoziviAjax.postPrisustvo(data.predmet, index, {sedmica: sedm, predavanja: 0, vjezbe: 1}, nacrtajTabeluPredmeta);
            else if (sta == 'pp')  PoziviAjax.postPrisustvo(data.predmet, index, {sedmica: sedm, predavanja: trenutna.predavanja-1, vjezbe: trenutna.vjezbe}, nacrtajTabeluPredmeta);
            else if (sta == 'npp') PoziviAjax.postPrisustvo(data.predmet, index, {sedmica: sedm, predavanja: trenutna.predavanja+1, vjezbe: trenutna.vjezbe}, nacrtajTabeluPredmeta);
            else if (sta == 'pv')  PoziviAjax.postPrisustvo(data.predmet, index, {sedmica: sedm, predavanja: trenutna.predavanja, vjezbe: trenutna.vjezbe-1}, nacrtajTabeluPredmeta);
            else if (sta == 'npv') PoziviAjax.postPrisustvo(data.predmet, index, {sedmica: sedm, predavanja: trenutna.predavanja, vjezbe: trenutna.vjezbe+1}, nacrtajTabeluPredmeta);
        });
    }
}

function nacrtajTabeluPredmeta(error, data) {

    if (!error) {
        var tabela = document.getElementById('tabela');
        
        rez = TabelaPrisustvo(tabela, data);
        var maxSedmica = rez.aktivnaSedmica;
        // console.log(rez);

        if (klik == 1) {
            trenutnaSedmica = rez.aktivnaSedmica;
            klik = 2;
        }

        dodajListenereNaCelije(data);

        sljedecaSedmica = function() {
            rez.sljedecaSedmica();
            dodajListenereNaCelije(data);
            if (trenutnaSedmica < maxSedmica) trenutnaSedmica++;
        }
        
        prethodnaSedmica = function() {
            rez.prethodnaSedmica();
            dodajListenereNaCelije(data);
            if (trenutnaSedmica != 1) trenutnaSedmica--;
        } 

        let koFolTrenutna = rez.aktivnaSedmica;
        while (koFolTrenutna > trenutnaSedmica) {
            rez.prethodnaSedmica();
            dodajListenereNaCelije(data);
            koFolTrenutna--;
        }
    }
}

window.onload = function() { 
    
    PoziviAjax.getPredmeti((error, data)=>{
        if (!error) {
          document.getElementById('divListaPredmeta').innerHTML = 
          '<ul>' + data.map(d => `<li onclick="PoziviAjax.getPredmet('${d.predmet}',nacrtajTabeluPredmeta)">${d.predmet}</li><br>`).join('') + '</ul>';
        }
      });
    
    document.getElementById('btnOdjava').addEventListener('click', function() {
        PoziviAjax.postLogout(()=>{
            window.location.href = 'http://localhost:3000/prijava.html';
        });
    });
}