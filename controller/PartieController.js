
module.exports = {


    async create_game(idCreator,name,idSystem,idMap, fuseauHorraire){
        db = require("./DatabaseConnection.js").createConnection();

        let query = "INSERT INTO Partie(idOrganisateur,nomPartie,idSysteme,idCarte,"+
                        "fuseauHorraire) VALUES('"+idCreator+"','"+
                        name+"','"+idSystem+"','"+idMap+"','"+fuseauHorraire+"');";

        console.log("query : "+query);

        await queryPartie(db,query);
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
    async affiche_joueur(idPartie){
        db = require("./DatabaseConnection.js").createConnection();
        
        query="SELECT idUtilisateur, pseudo FROM Joueur NATURAL JOIN Utilisateur WHERE idPartie = "+
            idPartie;
        console.log(query);

        const joueurs=await queryPartie(db,query);
        
        let j=[];
        for(i=0; i<joueurs.length;i++){
            j.push({"idJoueur": joueurs[i].idUtilisateur,"pseudo":joueurs[i].pseudo});
        }

        donnees = {
            "idPartie": idPartie,
            "joueurs":j
        };

        console.log(donnees)
        return donnees;

    },
    async accepte_joueur(idPartie,idUtilisateur){
        db = require("./DatabaseConnection.js").createConnection();
        
        query="INSERT INTO Joueur(idPartie,idUtilisateur) VALUES ('"+idPartie+"','"+idUtilisateur+"')";
        console.log(query);

        await queryPartie(db,query);
    },
    async supprime_joueur(idPartie,idUtilisateur){
        db = require("./DatabaseConnection.js").createConnection();
        
        query="DELETE FROM Joueur WHERE idPartie="+idPartie+" AND idUtilisateur="+idUtilisateur;
        console.log(query);

        await queryPartie(db,query);
    },
    async recuperer_caracteristique(){
        db = require("./DatabaseConnection.js").createConnection();
        
        query="SELECT * FROM Caracteristique WHERE typeCaracteristique='Partie'"
        console.log(query);

        const allcarac=await queryPartie(db,query);
        console.log(allcarac);

        let donnees=[]
        for(i=0;i<allcarac.length;i++){
            donnees.push({'idCaracteristique':allcarac[i].idCaracteristique,
                         'typeCaracteristique':allcarac[i].typeCaracteristique,
                         'valeurCaracteristique':allcarac[i].valeurCaracteristique})
        }

        console.log(donnees);
        return donnees;
    }


}


function queryPartie(db,query){
    
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