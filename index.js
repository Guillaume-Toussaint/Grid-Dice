"use strict";


const express = require('express');
//const session = require('cookie-session');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));


const port = 8000;


const ConnectionController =  require("./controller/ConnectionController.js");
//connec_control = new ConnectionController();

app.get('/', (req, res, next) => {

  res.render("acceuil.ejs");
});

app.get('/login_page',(req,res,next) => {


  res.render("connect.ejs");
});


app.get('/sign_up_page',(req,res,next) => {


  res.render("inscription.ejs");
});

app.get('/partie/:uuid', (req, res, next) => {
  //EXEMPLE D'USAGE

  //fonction qui récupère les infos d'une parties
  //res.render("frontend/partie_details.ejs");
});


app.get('/profile/:uuid', (req, res, next) => {
  res.render("acceuil.ejs");
});

app.get('/character/:uuid', (req, res, next) => {

  res.render("frontend/acceuil.ejs");
});
app.get('/search/:criteres', (req, res, next) => {

  res.render("frontend/acceuil.ejs");
});


app.get('/profile/contacts', (req, res, next) => {

  res.render("frontend/acceuil.ejs");
});

app.get('/search/contact/:uuid', (req, res, next) => {

});


app.post('/new/game', (req, res, next) => {
  console.log(req.body);
  res.status(201).json({
    message: 'Objet créé !'
  });
});

app.post('/new/character', (req, res, next) => {
  console.log(req.body);
  res.status(201).json({
    message: 'Objet créé !'
  });
});

app.post('/new/contact', (req, res, next) => {
  console.log(req.body);
  res.status(201).json({
    message: 'Objet créé !'
  });
});




app.post('/new/profile', (req, res, next) => {
  console.log(req.body);
  res.status(201).json({
    message: 'Objet créé !'
  });
});

app.post('/new/contact', (req, res, next) => {
  console.log(req.body);
  res.status(201).json({
    message: 'Objet créé !'
  });
});

app.post("/connect/", (req, res, next) => {
  console.log(req.body);
  let contenu = JSON.parse(JSON.stringify(req.body));
  console.log("Contenu : "+contenu);
  ConnectionController.sign_in(contenu.username,contenu.password);

  console.log("done");

  res.status(201);

  res.render('connect.ejs');
});

app.post("/signup/", (req, res, next) => {
  console.log(req.body);
  let contenu = JSON.parse(JSON.stringify(req.body));
  console.log("Contenu : "+contenu);
  let result = ConnectionController.sign_up(contenu.email,contenu.username,contenu.password);

  console.log("done");
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
  console.log(`Serveur lancé à  http://localhost:${port}`);
})
