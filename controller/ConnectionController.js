module.exports =  {




  /**
   * sign_in - Méthode de connexion
   *
   * @param  {str} username pseudo
   * @param  {str} pass     mot de passe
   * @return {Promise}
   */
  sign_in(username, pass) {
    const SHA512 = require("crypto-js/sha512");

    //Conenciton à la bdd
    ////console.log("Un utilisateur se connecte");

    const mysql = require("mysql");
    const passw = SHA512(pass).toString();

    const db = require("./DatabaseConnection.js").createConnection();

    //let requete = "Select * from Utilisateur where pseudo='"+mysql.escape(username)+"' and mdp='"+passw+"';";
    const requete = "Select * from Utilisateur where pseudo= ? and mdp= ?";
    ////console.log("Requête de connexion : "+requete);
    const values = [username, passw];
    return  new Promise(
            (resolve,reject) => {
              db.query(requete,values , (err, result) => {
                  if (err) {
                    reject(undefined);
                    //reject(err.message);
                }
                if(result[0]){
                  //console.log("Connexion de  : "+result[0].pseudo);
                   resolve(result[0]);
                }else{
                  resolve(undefined);
                }
                });
              }
            );


  },
  /**
   * sign_up - Méthode d'inscription
   *@param  {str} email email
   * @param  {str} username pseudo
   * @param  {str} pass     mot de passe
   * @return {Promise}
   */
  sign_up(email,username, pass) {
    let mysql = require("mysql");
    let SHA512 = require("crypto-js/sha512");

    //Conenciton à la bdd
    //console.log("Un utilisateur se connecte");


    let passw = SHA512(pass).toString();


    db = require("./DatabaseConnection.js").createConnection();
    var query = "INSERT INTO Utilisateur(email,pseudo,mdp) VALUES('"+email+"','"+username+"','"+passw+"');";
    //console.log("query : "+query);


    let reussite = db.query(query, function (err, result) {
    if (err) throw err;
    //console.log("Nouvel utilisateur créé ! ");
    });

  return reussite;

  }

};
