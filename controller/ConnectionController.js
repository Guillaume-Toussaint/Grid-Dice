module.exports =  {




    sign_in(username, pass) {
    let SHA512 = require("crypto-js/sha512");

    //Conenciton à la bdd
    //console.log("Un utilisateur se connecte");


    let passw = SHA512(pass).toString();

    db = require("./DatabaseConnection.js").createConnection();

    let requete = "Select * from Utilisateur where pseudo='"+username+"' and mdp='"+passw+"';";
    //console.log("Requête de connexion : "+requete);

    return  new Promise(
            (resolve,reject) => {
              db.query(requete, function (err, result) {
                  if (err) {
                    reject(err.message);
                }
                if(result[0]){
                  console.log("Connexion de  : "+result[0].pseudo);
                   resolve(result[0].pseudo);
                }
                });
              }
            );


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
