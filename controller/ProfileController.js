module.exports = {



  /**
   * Récupère les informations d'un utilisateurs
   *
   * @param  {int} iduser id de l'utilisateur
   * @return {object} données de l'utilisateur
   */
  get_profile_info(iduser){
    let mysql = require("mysql");
    let db = require("./DatabaseConnection.js").createConnection();

    let query = "SELECT * FROM Utilisateur NATURAL JOIN CaracteristiqueJoueur NATURAL JOIN Caracteristique where idUtilisateur= ?";

    //console.log("Query : "+query);

    return  new Promise(
            (resolve,reject) => {
              db.query(query, [iduser],function (err, result) {
                  if (err) {
                    //console.log(iduser);
                    reject(err.message);
                }
                //console.log(result);
                //console.log(result[0]);
                resolve(result[0]);
                });
              }
            );
  },


  async get_preference(iduser){
    return await donnees_prefrence(iduser);
  },



  /**
   * get_profile_info_by_pseudo récupère les infos d'un profil par pseudo
   *
   * @param  {str} pseudo pseudo
   * @return {object}  infos de l'utilisateur
   */
  get_profile_info_by_pseudo(pseudo){

    let mysql = require("mysql");
    let db = require("./DatabaseConnection.js").createConnection();

    let query = "SELECT * FROM Utilisateur where pseudo= ?";

    //console.log("Query : "+query);

    return  new Promise(
            (resolve,reject) => {
              db.query(query, [pseudo],function (err, result) {
                  if (err) {
                    reject(err.message);
                }
                //console.log(result[0]);
                resolve(result[0]);
                });
              }
            );
  },

  /**
   * account_exists - Vérifie si un comtpe existe avec son pseudo
   *
   * @param  {str} pseudo pseudo à check
   * @return {bool}  compte existant
   */
  account_exists(pseudo){
    let mysql = require("mysql");
    let db = require("./DatabaseConnection.js").createConnection();

    let query = "SELECT * FROM Utilisateur where pseudo= ?";
    console.log(query);

    return  new Promise(
            (resolve,reject) => {
              db.query(query, [pseudo],function (err, result) {
                  if (err) {
                    //console.log("err");
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



  /**
   * get_contacts - Récupère les contacts d'un utilisateur via son id
   *
   * @param  {int} idUser id de l'utilisateur dont on veut les contacts
   * @return {Array}  Tableau des contacts
   */
  get_contacts(idUser){
    const mysql = require("mysql");
    const db = require("./DatabaseConnection.js").createConnection();

    const query = "SELECT u1.idUtilisateur as id1 ,u1.pseudo as p1 ,u2.idUtilisateur as id2 ,u2.pseudo as p2,permission FROM Contact JOIN Utilisateur as u1 on u1.idUtilisateur = Contact.contact1 join Utilisateur as u2 on u2.idUtilisateur = Contact.contact2 where contact1 = ? OR contact2 = ?";
    //Ma fierté cette requête, elle marche du tonnerre et je m'attendais à un crash
    //console.log("Query : "+query);

    return  new Promise(
            (resolve,reject) => {
              db.query(query,[idUser,idUser] ,function (err, result) {
                  if (err) {
                    reject(err.message);
                }
                //console.log(result);
                resolve(result);
                });
              }
            );


  },


  /**
   * addContact - Ajoute une demande de contact entre deux utilisateurs
   *
   * @param  {int} contact1 utilisateur qui émet la demande
   * @param  {int} contact2 utilisateur qui la reçoit
   * @return {bool}     contact ajouté
   */
  addContact(contact1,contact2){


    const db = require("./DatabaseConnection.js").createConnection();

    const query = "INSERT IGNORE INTO Contact values(?,?,'pending')";


    const values = [contact1,contact2];


    //console.log("Query : "+query);

    return  new Promise(
            (resolve,reject) => {
              db.query(query,values ,function (err, result) {
                  if (err) {
                    //console.log(err.message);
                    reject(0);//0 si ça foire
                }
                ////console.log(result);
                //resolve(result);
                resolve(1);// 1 si ok
                });
              }
            );

  },


  /**
   * acceptContact - Accepte une demande de contact
   *
   * @param  {int} ownId     id de la personne qui accepte
   * @param  {int} contactId id de la personne qui a envoyé la demande
   * @return {bool}           contact ajouté
   */
  acceptContact(ownId,contactId){
    const db = require("./DatabaseConnection.js").createConnection();

    const query = "UPDATE Contact SET permission = 'normal' where (contact1= ? AND contact2 = ?) OR (contact1= ? AND contact2 = ?)";

    const values = [ownId,contactId,contactId,ownId];


    //console.log("Query : "+query);

    return  new Promise(
            (resolve,reject) => {
              db.query(query,values ,function (err, result) {
                  if (err) {
                    //console.log(err.message);
                    reject(0);//0 si ça foire
                }
                ////console.log(result);
                //resolve(result);
                resolve(1);// 1 si ok
                });
              }
            );
  },

  async queryp(db,query){

      //db = require("./DatabaseConnection.js").createConnection();

      return new Promise( (resolve,reject) => {
          db.query(query, (err,result) => {
              if (err) reject(err.message);
              else if(result){
                  //console.log(result);
                  resolve(result)
              }
          })
      });
  },


  /**
   * async userPreferences - Méthode multitâche servant à insérer ou modifier les préférences d'un utilisateur dans la base de données
   *
   * @param  {int} idUser           description
   * @param  {Array} arguments        description
   * @param  {Array} caracteristiques description
   */
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


  /**
   * async change_caracteristique - Change les caractéristiques d'un utilisateur
   *
   * @param  {int} idUser               description
   * @param  {array} listeCaracteristique description
   * @return {type}                      description
   */
  async change_caracteristique(idUser,listeCaracteristique){

      db = require("./DatabaseConnection.js").createConnection();

      //console.log("la ca vient de change_caracteristique")
      await queryPartie(db,"SELECT * FROM Utilisateur WHERE idUtilisateur="+idUser);

      let query="DELETE FROM CaracteristiqueJoueur WHERE idUtilisateur="+idUser;
      //console.log(query);
      await queryPartie(db,query);

      for(i=0;i<listeCaracteristique.length;i++){
          query="INSERT INTO CaracteristiqueJoueur (idUtilisateur,idCaracteristique) VALUES ("+idUser+","+
                  listeCaracteristique[i]+")";
          //console.log(query);
          await queryp(db,query);
      }


    },

    async edition_profil(parametre,idUser){

      db = require("./DatabaseConnection.js").createConnection();

      console.log("EDITION PROFIL");
      console.log(parametre);
      if(parametre.submit=="Enregistrer les parametre"){

      }
      if(parametre.submit=="Enregistrer les preferences"){

        let query="DELETE FROM PreferenceUtilisateur WHERE idUtilisateur="+idUser;
        console.log(query);
        await queryProfil(db,query);
        //for(i=0;i<parametre.length;i++){
        //    query="INSERT INTO PreferenceUtilisateur (idUtilisateur,idPreference) VALUES ("+idUser+","+
        //            parametre[i]+")";
        //    console.log(query);
        //    queryp(db,query);
        //}
        let valeur;
        Object.keys(parametre).forEach(element =>{
          console.log("element= "+parametre.element.Valeur);
          element.veleur.forEach(i =>{
            valeur ="SELECT `idPreference` FROM `Preference` WHERE `typePreference`='"+element+"' and `Valeur`='"+i+"' ";
            console.log(valeur)
            query="INSERT INTO PreferenceUtilisateur (idUtilisateur,idPreference) VALUES ("+idUser+","+
            valeur+")";
            console.log(query);
            queryProfil(db,query);
          });
        });
      }


    }





};

 async function donnees_prefrence(user){

  db = require("./DatabaseConnection.js").createConnection();

  let donnees=[];
  //console.log("DONNES PREFRENCE FUNCTION");

  let query = 'SELECT Valeur FROM Utilisateur NATURAL JOIN PreferenceUtilisateur NATURAL JOIN Preference where idUtilisateur='+user+' and typePreference="Niveau"'
  //console.log(query);
  const niveau= await queryProfil(db,query);


  query = 'SELECT Valeur FROM Utilisateur NATURAL JOIN PreferenceUtilisateur NATURAL JOIN Preference where idUtilisateur='+user+' and typePreference="Genre"'
  //console.log(query);
  const genre= await queryProfil(db,query);


  query = 'SELECT Valeur FROM Utilisateur NATURAL JOIN PreferenceUtilisateur NATURAL JOIN Preference where idUtilisateur='+user+' and typePreference="Systeme"'
  //console.log(query);
  const systeme= await queryProfil(db,query);


  query = 'SELECT Valeur FROM Utilisateur NATURAL JOIN PreferenceUtilisateur NATURAL JOIN Preference where idUtilisateur='+user+' and typePreference="Meta"'
  //console.log(query);
  const meta= await queryProfil(db,query);


  donnees.push(niveau,genre,systeme,meta);
  //console.log(donnees);
  return donnees;
}
function queryProfil(db,query){

  //db = require("./DatabaseConnection.js").createConnection();

  return new Promise( (resolve,reject) => {
      db.query(query, (err,result) => {
          if (err) reject(err.message);
          else if(result){
              //console.log(result);
              resolve(result)
          }
      })
  });
}
