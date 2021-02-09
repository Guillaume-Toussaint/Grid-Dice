module.exports =  {




    async sign_in(username, pass,req) {
    let SHA512 = require("crypto-js/sha512");

    //Conenciton à la bdd
    console.log("Un utilisateur se connecte");


    let passw = SHA512(pass).toString();

    db = require("./DatabaseConnection.js").createConnection();

    let requete = "Select * from Utilisateur where pseudo='"+username+"' and mdp='"+passw+"';";
    console.log("Requête de connexion : "+requete);

    await db.query(requete, function (err, result) {
    if (err) throw err;

    if(result[0]){
      console.log("Connexion de  : "+result[0].pseudo);
      return result[0].pseudo;
    }
    });
    //console.log("Connexion réussie");
    //console.log("Connexion de  : "+reussite);
    /*if(reussite[0]){
      return reussite[0].pseudo;
    }else{
      return null;
    }
    */

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
