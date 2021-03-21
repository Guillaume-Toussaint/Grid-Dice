module.exports = {

  /**
   * createConnection - Crée un object cde connexion avec la base de données
   *
   * @return {type}  description
   */
  createConnection(){


    let  con = require("mysql").createConnection({
      host: "mysql-pware.alwaysdata.net",
      user: "pware_userprojet",
      password: "=fD`{g^pJkZ5Vw{",
      database: "pware_techno_web_avancees"
    });

    con.connect(function(err) {
      if (err) throw err;
      //si la connexion est réussie


    });

    return con;

  }


};
