module.exports = {

  get_profile_info(iduser){
    let mysql = require("mysql");
    let db = require("./DatabaseConnection.js").createConnection();

    let query = "SELECT * FROM Utilisateur NATURAL JOIN CaracteristiqueJoueur NATURAL JOIN Caracteristique where idUtilisateur= ?";

    console.log("Query : "+query);

    return  new Promise(
            (resolve,reject) => {
              db.query(query, [iduser],function (err, result) {
                  if (err) {
                    reject(err.message);
                }
                console.log(result);
                resolve(result);
                });
              }
            );
  },



  get_contacts(idUser){
    const mysql = require("mysql");
    const db = require("./DatabaseConnection.js").createConnection();

    const query = "SELECT u1.idUtilisateur as id1 ,u1.pseudo as p1 ,u2.idUtilisateur as id2 ,u2.pseudo as p2 FROM Contact JOIN Utilisateur as u1 on u1.idUtilisateur = Contact.contact1 join Utilisateur as u2 on u2.idUtilisateur = Contact.contact2 where contact1 = ? OR contact2 = ?";
    //Ma fierté cette requête, elle marche du tonnerre et je m'attendais à un crash
    console.log("Query : "+query);

    return  new Promise(
            (resolve,reject) => {
              db.query(query,[idUser,idUser] ,function (err, result) {
                  if (err) {
                    reject(err.message);
                }
                console.log(result);
                resolve(result);
                });
              }
            );


  },

  //Idée : on met un contact en pending jusqu'à ce qu'il soit accepté
  addContact(contact1,contact2){

    const db = require("./DatabaseConnection.js").createConnection();

    const query = "INSERT INTO Contact values(?,?,'pending')";


    const values = [contact1,contact2];


    console.log("Query : "+query);

    return  new Promise(
            (resolve,reject) => {
              db.query(query,[idUser] ,function (err, result) {
                  if (err) {
                    console.log(err.message);
                    reject(0);//0 si ça foire
                }
                //console.log(result);
                //resolve(result);
                resolve(1);// 1 si ok
                });
              }
            );

  },


  acceptContact(ownId,contactId){
    const db = require("./DatabaseConnection.js").createConnection();

    const query = "UPDATE TABLE Contact SET COLUMN permission = 'normal' where contact1= ? AND contact2 = ?";

    const values = [ownId,contactId];


    console.log("Query : "+query);

    return  new Promise(
            (resolve,reject) => {
              db.query(query,values ,function (err, result) {
                  if (err) {
                    console.log(err.message);
                    reject(0);//0 si ça foire
                }
                //console.log(result);
                //resolve(result);
                resolve(1);// 1 si ok
                });
              }
            );
  }



};
