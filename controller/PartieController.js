
module.exports = {


    create_game(idCreator,name,idSystem,idMap, fuseauHorraire){
        db = require("./DatabaseConnection.js").createConnection();

        let query = "INSERT INTO Partie(idOrganisateur,nomPartie,idSysteme,idCarte,"+
                        "fuseauHorraire) VALUES('"+idCreator+"','"+
                        name+"','"+idSystem+"','"+idMap+"','"+fuseauHorraire+"');";

        console.log("query : "+query);

        db.query(query,function (err,result){
            if (err) throw err;
            else if(result[0]){
                console.log("Partie créée"+result[0].idPartie);
            }
        })
    },
    async affiche_partie(idUtilisateur){
        db = require("./DatabaseConnection.js").createConnection();

        let donnees=[]

        let query = "SELECT idPartie FROM Joueur WHERE idUtilisateur="+idUtilisateur;
        console.log("query: "+query)

        const parties= await queryPartie(db,query);
        console.log(parties[0]);
        console.log("nbPartie: "+parties.length);
        

        for(i=0;i<parties.length;i++){
            
            partie=parties[i].idPartie
            console.log("idPartieActuelle="+partie)

            query = "SELECT nomPartie, pseudo, nomSysteme, fuseauHorraire, DescriptionPartie, nomCarte, dateCréationPartie as dateCreationPartie "+
                    "FROM Utilisateur NATURAL JOIN Partie NATURAL JOIN Systeme NATURAL JOIN Carte "+
                    "WHERE idOrganisateur=idUtilisateur AND idPartie="+partie
            console.log(query)
            const infoPartie= await queryPartie(db,query);


            query="SELECT count(idUtilisateur) as infoNbJoueur FROM Joueur WHERE idPartie="+partie
            console.log(query)
            const nbJoueur= await queryPartie(db,query);


            query = "SELECT valeurCaracteristique FROM CaracteristiquePartie NATURAL JOIN Caracteristique WHERE idPartie="+partie
            console.log(query)
            const infoCarac= await queryPartie(db,query);

            
            donnees.push(formatDonnees(partie,infoPartie,nbJoueur,infoCarac));
            
        }

        console.log(donnees)
        console.log(donnees[0])
        console.log(donnees[0].idPartie)
        console.log(donnees[0].donnee)
        return donnees;

        
        
    },


}

/*
db.query(query,function (err,result){
    if (err) throw err;
    else if(result){
        console.log(result)
    }
})

SELECT nomPartie, pseudo, nomSysteme, fuseauHorraire, DescriptionPartie, nomCarte, dateCréationPartie
FROM Utilisateur NATURAL JOIN Partie NATURAL JOIN Systeme NATURAL JOIN Carte
WHERE idPartie=1 AND idOrganisateur=idUtilisateur
*/

function queryPartie(db,query){
    
    
    
    return new Promise( (resolve,reject) => {
        db.query(query, (err,result) => {
            if (err) reject(err.message);
            else if(result){
                console.log(result);
                resolve(result)
            }
        })
    });
}


function formatDonnees(idPartie,infoPartie,nbJoueur,infoCarac){
    
    

    if(infoPartie.length == 1) infoPartie=infoPartie[0];
    else console.log("Wesh mec, ya trop d'info pour une seule partie ! ")

    if(nbJoueur.length == 1) nbJoueur=nbJoueur[0];
    else console.log("Wesh mec, ya trop de nombre de joueurs pour une seule partie ! ")

    let caracteristiques=[];
    for(i=0;i<infoCarac.length;i++){
        caracteristiques.push({'caracteristique':infoCarac[i].valeurCaracteristique});
    }

    console.log(caracteristiques)

    let donnee={
        'idPartie':idPartie,
        'donnee':{
            'nomPartie':infoPartie.nomPartie,
            'nomSysteme': infoPartie.nomSysteme,
            'pseudoCreateur': infoPartie.pseudo,
            'nomCarte': infoPartie.nomCarte,
            'descriptionPartie': infoPartie.DescriptionPartie,
            'nombreJoueur': nbJoueur.infoNbJoueur,
            'dateCreationPartie':infoPartie.dateCreationPartie,
            caracteristiques
        }
    };

    console.log(donnee)
    return donnee;
}