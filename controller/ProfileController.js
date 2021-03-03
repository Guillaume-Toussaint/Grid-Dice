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
                console.log(result[0]);
                resolve(result[0]);
                });
              }
            );
  },
  get_profile_info_by_pseudo(pseudo){
    let mysql = require("mysql");
    let db = require("./DatabaseConnection.js").createConnection();

    let query = "SELECT * FROM Utilisateur NATURAL JOIN CaracteristiqueJoueur NATURAL JOIN Caracteristique where pseudo= ?";

    console.log("Query : "+query);

    return  new Promise(
            (resolve,reject) => {
              db.query(query, [pseudo],function (err, result) {
                  if (err) {
                    reject(err.message);
                }
                console.log(result[0]);
                resolve(result[0]);
                });
              }
            );
  },

  account_exists(pseudo){
    let mysql = require("mysql");
    let db = require("./DatabaseConnection.js").createConnection();

    let query = "SELECT * FROM Utilisateur where pseudo= ?";


    return  new Promise(
            (resolve,reject) => {
              db.query(query, [pseudo],function (err, result) {
                  if (err) {
                    console.log("err");
                    reject(err.message);
                }
                if(result[0]!=undefined){
                resolve(true);}else{
                  resolve(false);
                }
                });
              }
            );
  },



  get_contacts(idUser){
    const mysql = require("mysql");
    const db = require("./DatabaseConnection.js").createConnection();

    const query = "SELECT u1.idUtilisateur as id1 ,u1.pseudo as p1 ,u2.idUtilisateur as id2 ,u2.pseudo as p2,permission FROM Contact JOIN Utilisateur as u1 on u1.idUtilisateur = Contact.contact1 join Utilisateur as u2 on u2.idUtilisateur = Contact.contact2 where contact1 = ? OR contact2 = ?";
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

    const query = "INSERT IGNORE INTO Contact values(?,?,'pending')";


    const values = [contact1,contact2];


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

  },


  acceptContact(ownId,contactId){
    const db = require("./DatabaseConnection.js").createConnection();

    const query = "UPDATE TABLE Contact SET COLUMN permission = 'normal' where (contact1= ? AND contact2 = ?) OR (contact= ? AND contact2 = ?)";

    const values = [ownId,contactId,contactId,ownId];


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
  },

  queryp(db,query){

      //db = require("./DatabaseConnection.js").createConnection();

      return new Promise( (resolve,reject) => {
          db.query(query, (err,result) => {
              if (err) reject(err.message);
              else if(result){
                  console.log(result);
                  resolve(result)
              }
          })
      });
  },


  async userPreferences(idUser,arguments,caracteristiques){
    db = require("./DatabaseConnection.js").createConnection();


    /*if(idCreator!=null) arguments.push({'key': "idtilisateur", 'value':idCreator});
    if(name!=null) arguments.push({'key':"nomPartie",'value':"\""+name+"\""});
    if(idSystem!=null) arguments.push({'key':"idSysteme",'value':+idSystem});
    if(idCarte!=null) arguments.push({'key':"idCarte",'value':idCarte});
    if(fuseauHorraire!=null) arguments.push({'key':"fuseauHorraire",'value':fuseauHorraire});
    if(description!=null) arguments.push({'key':"DescriptionPartie",'value':"\""+description+"\""});*/

    const query = "";
    switch(processus){
        case "Create":
            query="INSERT INTO Utilisateur (";
            for(i=0;i<arguments.length;i++){
                if(i==0) query+=arguments[i].key;
                else query+=","+arguments[i].key;
            }
            query+=") VALUES (";
            for(i=0;i<arguments.length;i++){
                if(i==0) query+=arguments[i].value;
                else query+=","+arguments[i].value;
            }
            query+=")";
            break;
        case "Update":
            query="UPDATE Utilisateur SET ";
            for(i=0;i<arguments.length;i++){
                if(i==0) query+=arguments[i].key+"="+arguments[i].value;
                else query+=","+arguments[i].key+"="+arguments[i].value;
            }
            query+=" WHERE idUtilisateur="+idUser;
            break;
        case "Delete":
            query="DELETE FROM Utilisateur WHERE idUtilisateur="+idUser;
            listeCaracteristique=[];
            break;
          }

          const res=await queryp(db,query);
          if(res.insertId!=0) idPartie=res.insertId;

  },

  async change_caracteristique(idUser,listeCaracteristique){

      db = require("./DatabaseConnection.js").createConnection();

      console.log("la ca vient de change_caracteristique")
      await queryPartie(db,"SELECT * FROM Utilisateur WHERE idUtilisateur="+idUser);

      let query="DELETE FROM CaracteristiqueJoueur WHERE idUtilisateur="+idUser;
      console.log(query);
      await queryPartie(db,query);

      for(i=0;i<listeCaracteristique.length;i++){
          query="INSERT INTO CaracteristiqueJoueur (idUtilisateur,idCaracteristique) VALUES ("+idUser+","+
                  listeCaracteristique[i]+")";
          console.log(query);
          await queryp(db,query);
      }


    }







};
