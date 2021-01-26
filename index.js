"use strict";


const express = require('express');
//const session = require('cookie-session');
//const bodyParser = require('body-parser');
//const urlencodedParser = bodyParser.urlencoded({ extended: false });

const app = express();
const port = 8000;
app.get('/', (req, res, next) => {

  res.render("acceuil.ejs");
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
  res.status(201).json({
    message: 'Objet créé !'
  });
});

app.post("/signup/", (req, res, next) => {
  console.log(req.body);
  res.status(201).json({
    message: 'Objet créé !'
  });
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
