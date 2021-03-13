module.exports = {


  async recommend_to(idUser){
    const prefs = await get_user_preferences(idUser);
    console.log("Préférences de l'user : ");
    console.log(prefs);

    const games_caracs = await get_games_caracs();
    console.log("Ensemble de caracs des jeux");
    console.log(games_caracs);


      let parties_reco = [];
      //console.log(ensembrePrefs);
      console.log("On calcule les indexs");
      for(s in games_caracs){
        console.log('Index entre les prefs utilisateur et la partie '+s);
        const index = index_jacquard(prefs,games_caracs[s]);
        console.log(index);
        parties_reco.push([s,index]);
      }
      console.log("Liste des parties avec index avant tri");
      console.log(parties_reco);


      parties_reco.sort((e1,e2) => {
        return (e2[1] - e1[1]); // Tri décroissant
      });
      console.log("Liste des parties avec index après tri");
      console.log(parties_reco);//Tri accompli


      console.log("On passe à la récup des données");
      //Liste des id à récup
      /*const listeIds = parties_reco.map(e => {
        return {idPartie : parseInt(e[0],10)}});
      console.log(listeIds);
     const pc = require("../controller/PartieController");


     const donneesPartiesReco = pc.donnees_parties(listeIds);*/
     const pc = require("../controller/PartieController");
     let donneesPartiesReco = [];
     for(let p=0; p<parties_reco.length;p++){
       console.log(p);
       donneesPartiesReco.push({idPartie : parties_reco[p][0]});
     }

     donneesPartiesReco = await pc.get_donnees_partie(donneesPartiesReco);
     console.log(donneesPartiesReco);

     return donneesPartiesReco;
  }



}
function get_user_preferences(idUser){
  let query = "SELECT idCaracteristique from Utilisateur NATURAL JOIN CaracteristiqueJoueur where idUtilisateur = ?";
  let db = require("../controller/DatabaseConnection.js").createConnection();
  return new Promise( (resolve,reject) => {
      db.query(query, [idUser],(err,result) => {
          if (err) reject(err.message);
          else if(result){
              //console.log(result);
              let ensemblePrefs  = new Set();
              result.forEach((e) =>{
                ensemblePrefs.add(e.idCaracteristique);
              });
              resolve(ensemblePrefs);
          }else{
            resolve(null);
          }
      })
  });

}

function get_games_caracs(){
    let query = "SELECT idPartie,idCaracteristique from Partie NATURAL JOIN CaracteristiquePartie";
    let db = require("../controller/DatabaseConnection.js").createConnection();
    return new Promise( (resolve,reject) => {
        db.query(query,(err,result) => {
            if (err) reject(err.message);
            else if(result){
                //console.log(result);
                let caracs  = {};
                result.forEach((e) =>{
                  if(!caracs[e.idPartie]){
                    caracs[e.idPartie] = new Set();
                  }

                  caracs[e.idPartie].add(e.idCaracteristique);
                });
                resolve(caracs);

                resolve(result)
            }else{
              resolve(null);
            }
        });
    });

  }



  function index_jacquard(set1,set2){
    const num = intersection(set1,set2).size;

    const den = union(set1,set2).size;
    return num/den;
  }




  function union(set1, set2) {
  var union = new Set(set1);
  for (let elem of set2) {
    union.add(elem);
  }
  return union;
}

function intersection(set1, set2) {
  var intersection = new Set();
  for (let elem of set2) {
    if (set1.has(elem)) {
      intersection.add(elem);
    }
  }
  return intersection;
}
