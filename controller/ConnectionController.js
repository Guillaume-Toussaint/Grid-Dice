module.exports =  {




  sign_in(username, pass) {
    let SHA512 = require("crypto-js/sha512");

    //Conenciton à la bdd
    console.log("Un utilisateur se connecte");


    let passw = SHA512(pass).toString();

    db = require("./DatabaseConnection.js").createConnection();




  },

  sign_up(email,username, pass) {
    let SHA512 = require("crypto-js/sha512");

    //Conenciton à la bdd
    console.log("Un utilisateur se connecte");


    let passw = SHA512(pass).toString();


    db = require("./DatabaseConnection.js").createConnection();
    var query = "INSERT INTO Utilisateur(email,pseudo,mdp) VALUES('"+email+"','"+username+"','"+passw+"');";
    console.log("query : "+query);


    let reussite = db.query(query, function (err, result) {
    if (err) throw err;
    console.log("Nouvel utilisateur créé ! ");
    });

  return reussite;

  }

};
