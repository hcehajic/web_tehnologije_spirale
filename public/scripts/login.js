// testni login podaci:

// username1
// sifra1

// username2
// sifra2

window.onload = function() {
    // console.log(document.getElementById('sifra').value);
    document.getElementById('dugme').addEventListener('click', function(){
        console.log('pozove se');
        PoziviAjax.postLogin(document.getElementById('username').value, document.getElementById('sifra').value, (error, data)=>{
            if (!error) {
                console.log(data);
                if (data == 'Neuspješna prijava') document.getElementById('porukaPrijave').innerHTML = 'Neuspješna prijava';
                else window.location.href = 'http://localhost:3000/predmeti.html';  
            }
        })
    });
}