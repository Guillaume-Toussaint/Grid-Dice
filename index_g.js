"use strict";


const express = require('express');
//const session = require('cookie-session');
const bodyParser = require('body-parser');
const session = require('express-session')

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("views"));
app.use(ignoreFavicon);

app.use(bodyParser.json());
app.use(session({
  secret : "Hello world",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

function ignoreFavicon(req, res, next) {
  if (req.originalUrl.includes('favicon.ico')) {
    res.status(204).end()
  }
  next();
}
const port = 8000;


const ConnectionController =  require("./controller/ConnectionController.js");
const ProfileController = require("./controller/ProfileCOntroller.js");
const PartieController = require("./controller/PartieController.js");
const GameRecommender = require("./recommender/GameRecommender.js");


//************ DECOMMENTER POUR TESTER LES RECOMMENDATIONS AVEC IDUSER = 1 | Ne pas laisser en prod
//GameRecommender.recommend_to(1);

//connec_control = new ConnectionController();

app.get('/', (req, res, next) => {
  //console.log(req.session.pseudo);
  res.render("acceuil.ejs",{session : req.session});
});

//recherche test

app.get('/searchpage',async (req,res,next) => {
  res.render('recherche.ejs');
});

app.post('/recherche',async (req,res,next) => {
  //console.log("Body de la requête");
  //console.log(req.body)
  const parties = await PartieController.recherche_partie(req.body.saisie,req.body.dans,req.body.carac);
  //console.log("after recup parties");
  //console.log(parties);
  //console.log(parties[0].donnee.caracteristiques);
  res.render('resultat.ejs',{res : parties});
});

app.post('/editionprofile',async (req,res,next) => {
  console.log("Body de la requête");
  console.log(req.body)
  let preference = await ProfileController.edition_profil(req.body,req.session.idUser);
  let infos = await ProfileController.get_profile_info(req.session.idUser);
  //console.log("after recup parties");
  //console.log(parties);
  //console.log(parties[0].donnee.caracteristiques);
  res.render('profil.ejs',{infos: infos,preference: preference, session : req.session});
});




app.get('/login_page',(req,res,next) => {


  res.render("connect.ejs");
});


app.get('/sign_up_page',(req,res,next) => {


  res.render("inscription.ejs");
});


app.get('/partie', async (req, res, next) => {
  //EXEMPLE D'USAGE
  if(req.session.connected){
  const informations = await PartieController.get_donnees_partie([{idPartie : req.session.idUser}]);
  //console.log("On a les informations de la partie à afficher en détails");
  //console.log(informations);
  //fonction qui récupère les infos d'une parties
  res.render("detail_partie.ejs",{infos : informations[0], session : req.session});
} else{
  res.redirect("/login_page");
}
});


app.get('/profile', async (req, res, next) => {

  
  if(req.session.connected){
    
    let infos = await ProfileController.get_profile_info(req.session.idUser);
    //console.log("Infos récupérées Profil");
    let preference = await ProfileController.get_preference(req.session.idUser);
    //console.log(preference);
    res.render("profil.ejs",{infos : infos, preference: preference, session : req.session });
  } else{
    res.redirect("/login_page");
  }
});

app.get('/edit', async (req, res, next) => {

  
  if(req.session.connected){
    res.render("edition_profil.ejs",{session : req.session})
  } else{
    res.redirect("/login_page");
  }
});

app.get('/character/:uuid', (req, res, next) => {

  res.render("frontend/acceuil.ejs");
});
app.get('/search/:criteres', (req, res, next) => {

  res.render("frontend/acceuil.ejs");
});

app.get("/flux",async (req,res)=>{
  const parties = await GameRecommender.recommend_to(req.session.id);


  res.render("flux.ejs",{res : parties, session : req.session});
});


app.get('/contacts/', async (req, res, next) => {
  //let test = 1;//test, à changer par l'id utilisateur contenu dans le token
  const contacts = await ProfileController.get_contacts(req.session.idUser);//remplacer par userId
  //res.render("frontend/acceuil.ejs");
  res.render('contacts.ejs',{contact : contacts, username : req.session.pseudo, id : req.session.id, session : req.session});
  //res.send(contacts);
});

app.get('/search/contact/:pseudo', async (req, res, next) => {
  //console.log("Req : "+req.params.pseudo);
  const exists = await ProfileController.account_exists(req.params.pseudo);
  //console.log("Account exist : "+exists);
  if(exists){
    res.sendStatus(200);
  }else{
      res.sendStatus(404);//Code test
  }


});

app.get("/disconnect",(req,res)=>{
  if(req.session.connected && req.session.pseudo){
    delete req.session.connected;
    delete req.session.pseudo;
    res.redirect("/login_page");
  }else{

  }


});


app.post('/new/game', (req, res, next) => {
  //console.log(req.body);
  res.status(201).json({
    message: 'Objet créé !'
  });
});

app.post('/new/character', (req, res, next) => {
  //console.log(req.body);
  res.status(201).json({
    message: 'Objet créé !'
  });
});

app.post('/new/contact', async (req, res, next) => {
  //console.log("Ajout d'un contact");
  //console.log("on enregistre")
  //console.log(req.body);
  const other = await ProfileController.get_profile_info_by_pseudo(req.body.nom);
  const reussite = await ProfileController.addContact(req.session.idUser,other.idUtilisateur);
  if(reussite){
    res.sendStatus(200);
  }
  else{
    res.sendStatus(403);
  }
});

app.post('/accept/invite', async (req, res, next) => {

  const other = await ProfileController.get_profile_info_by_pseudo(req.body.nom);
  const reussite = await ProfileController.acceptContact(req.session.idUser,other.idUtilisateur);
  if(reussite){
    res.sendStatus(200);
  }
  else{
    res.sendStatus(403);
  }

});



app.post('/new/profile', (req, res, next) => {
  //console.log(req.body);
  res.status(201).json({
    message: 'Objet créé !'
  });
});







app.post("/connect/", async (req, res, next) => {
  ////console.log(req.body);
  ////console.log("Contenu : "+contenu);
  const user =  await ConnectionController.sign_in(req.body.username,req.body.password);


    if(user){
      req.session.idUser = user.idUtilisateur;
      req.session.pseudo = user.pseudo;
      req.session.connected = true;
      ////console.log("Session mise en place");
      res.status(200).redirect('/');
    }else{//Problème à la connexion, changer après
      res.status(403).send("Impossible de vous connecter avec ces identifiants");

    }


/*  //console.log("Promise : "+promise);
  res.redirect('/');*/
});






app.post("/signup/", (req, res, next) => {
  //console.log(req.body);
  let contenu = JSON.parse(JSON.stringify(req.body));
  //console.log("Contenu : "+contenu);
  let result = ConnectionController.sign_up(contenu.email,contenu.username,contenu.password);

  //console.log("done");
  if(result){
  res.redirect("/login_page/");
}else{
  res.status(500);
  res.send("Impossible de vous inscrire");
}

});



//PUT routes



app.put('/update/game/:uuid', (req, res, next) => {

});

app.put('/update/profile/:uuid', (req, res, next) => {

});

app.put('/update/character/:uuid', (req, res, next) => {

});

//DELETE routes
app.delete('/delete/contact/:uuid', (req, res, next) => {

});

app.delete('/delete/profile/:uuid', (req, res, next) => {

});
app.delete('/delete/game/:uuid', (req, res, next) => {

});


app.delete('/delete/character/:uuid', (req, res, next) => {

});

module.exports = app;

app.listen(port, () => {
  //console.log(`Serveur lancé à  http://localhost:${port}`);
})
