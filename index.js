const express = require('express'); //impordib node_modules/ kaustas oleva express/ kausta, kus asub Express raamistik. Tühi sulupaar rea lõpus käivitab mooduli sees oleva koodi, mis tagastab objekti, mille salvestame app nimelisse muutujasse.
const app= express();
const port = 8080 //Muutuja port väärtuseks paneme selle pordi numbri, millel soovime rakendust kuulama panna. Kasutame pordi määramiseks muutujat, et vajadusel saaks porti muuta ainult ühe muutuja väärtuse muutmisega.
const swaggerUi = require('swagger-ui-express'); //laadib sisse swagger-ui-expressI raamistiku
//const swaggerDocument = require('./docs/swagger.json'); //defineerib swaggeri dokumentatsiooni asukoha ning laadib selle sisse
const yamljs=require('yamljs');//laadib sisse yamljs raamistiku
const swaggerDocument = yamljs.load('./docs/swagger.yml'); //laaditakse .yaml fail
app.use(express.json());
const games=[ //lisame püsiprogrammeeritud massiiviga 8 mängu. Siinkohal saavad need, kes soovivad päris andmebaasiga projekti teha, kirjutada koodi, mis võtab games muutujasse andmed andmebaasist.
    {id:1,name:"Witcher 3",price:29.99},
    {id:2,name:"Cyberpunk 2077",price:59.99},
    {id:3,name:"Minecraft",price:26.99},
    {id:4,name:"Counter-Strike: Global Offensive",price:0},
    {id:5,name:"Roblox",price:0},
    {id:6,name:"Grant Theft Auto V",price:29.99},
    {id:7,name:"Valorant",price:0},
    {id:8,name:"Forza Horizon 5",price:59.99}
];
app.get('/games', (req,res)=>{ //kutsud app objektist välja get() meetodi, andes esimeseks argumendiks "/games" ja teiseks argumendiks funktsiooni, mis käivitatakse, kui keegi teeb GET /games päringu meie API vastu. See funktsioon koostab vastuse sellele päringule. Selles funktsioonis on sul ligipääs kahele objektile: req(uest) ja res(ponse). Muutuja reqi seest saad lugeda andmeid, mis klient päringuga saatis. Selle lõpp-punkti jaoks meil sissetulevaid andmeid vaja pole. Muutuja res võimaldab panna vastusesse andmeid, mida me tahame kliendile tagasi saata.
    res.send(games); //asendame seal varem olnud kahe mänguga püsiprogrammeeritud massiivi games muutujaga, mille defineerisime real 6.
});

app.get('/games/:id', (req,res)=>{ //lisame /games/:id lõpp-punkti. See :id on mingi number, mis näitab, millise mängu infot päriti (nt kui päring on GET /games/8, siis :id väärtus on 8).
    if(typeof games[req.params.id-1]==='undefined'){
        return res.status(404).send({error:"Game not foud"}); //kui ei ole leinud näitab viga
    }
    res.send(games[req.params.id-1]); //saadame päringu vastusena tagasi games massiivist selle liikme, mille indeks on :id väärtus.
});
app.post('/games',(req,res)=>{ //lisatakse mängude massiivi uus objekt
    if(!req.body.name || !req.body.price){
        return res.status(400).send({ error: 'One or all params are missing'});
    }
    let game ={
        id:games.length+1, //id väärtuseks on massiivi liikmete hetkearv + 1, 
        price: req.body.price,//üritati lugeda .price attribuuti selliselt objektilt, mis pole defineeritud. index.js real 35 on price: req.body.price. Sellest saame tuletada, et see objekt, mis pole defineeritud, on req.body. 
        name: req.body.name
    };
    games.push(game)
    res.status(201)
        .location(`${getBaseUrl(req)}/games/${games.length}`)
        .send(game);
});
app.delete('/games/:id',(req,res)=>{// lisame /games /:id lõpp-punkti. See :id on mingi number, mis näitab, millise mängu infot kustutakse (nt kui päring on GET /games/8, siis kustutatakse mäng, mille id väärtus on 8).
    if(typeof games[req.params.id -1]==='undefined'){//kontrollitakse games massiivi sisu, vastavalt antud indeksile. Kui indeks ei ole massiivis, tagastatakse undefined
       return res.status(404).send({error:"Games not found"});
    }
    games.splice(req.params.id-1,1);//kasutame funktsiooni splice, millega eemaldame elemendi massiivist. Esimeseks funktsiooni parameetriks anname alguse ehk 0 koha massiivist, kust hakatakse elemente eemaldama. Teiseks parameetriks anname arvu, mitu elementi eemaldatakse.
    res.status(204).send({error:"No content"});// anname õige tagastatava staatuskoodi: 204 No Content
});
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)); //seadistatakse üles lõpp-punkt /docs, kus on lisatud swaggerUI

//kutsume app muutujast välja meetodi listen() ja anname selle meetodi esimeseks argumendiks port muutujas oleva numbri, pannes sellega rakenduse kuulama võrgus seda porti sissetulevate päringute osas. 
app.listen(port,()=> {
    console.log(`API up at: http://localhost:${port}`); //Teine, valikuline argument listen meetodil määratleb funktsiooni, mis läheb siis käima, kui rakendus on hakanud võrgus porti kuulama. Selles funktsioonis prindime me konsoolile aadressi, millel rakendus kättesaadav on. Nii on mugav aadressi brauserisse kopeerida ja osades terminalides (nagu nt VS Code) on aadress ka klõpsatav.
});
function getBaseUrl(req){
    return req.connection && req.connection.encryptesd ? 'https' : 'http' + `://${req.headers.host}`;
};