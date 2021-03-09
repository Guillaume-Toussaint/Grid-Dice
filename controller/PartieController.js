const { query } = require("express");

module.exports = {

    /**
     * fonction qui permet de créer, modifier et supprimer une partie. Modifie aussi les
     * caractéristiques de la partie selectionnée.
     * @param {* type } processus chaine de caractère pour l'action de la fonction. 
     *          Peut être : Create, Update, Delete
     * @param {* type } idPartie l'identifiant de la partie à modifier. Par convention mettre -1
     *          pour la création
     * @param {* type } idCreator l'identifiant de l'organisateur de la partie. Mettre à null
     *          lorsqu'il n'est pas nécessaire 
     * @param {* type } name nom de la partie. Mettre à null lorsqu'il n'est pas nécessaire 
     * @param {* type } idSystem identifiant du système utilisé pour la partie. Mettre à null
     *          lorsqu'il n'est pas nécessaire 
     * @param {* type } idCarte identifiant de la carte utilisé pour la partie. Mettre à null
     *          lorsqu'il n'est pas nécessaire 
     * @param {* type } fuseauHorraire fuseau horraire utilisé pour la partie à partir du 
     *          méridien de greenwich (GMT + fuseauHorraire). Mettre à null lorsqu'il n'est pas
     *          nécessaire
     * @param {* type } description description de la partie. Mettre à null lorsqu'il n'est pas
     *          nécessaire 
     * @param {* Array} listeCaracteristique tableau contenant les identifiants de caractéristiques
     *          à ajouter ou supprimer de la partie. Si le tableau est vide, les caractéristiques
     *          ne seront plus liées à la partie.
     */
    async modifie_partie(processus,idPartie,idCreator,name, idSystem,idCarte,fuseauHorraire,
                        description,listeCaracteristique){
        db = require("./DatabaseConnection.js").createConnection();

        let arguments=[];
        if(idCreator!=null) arguments.push({'key': "idOrganisateur", 'value':idCreator});
        if(name!=null) arguments.push({'key':"nomPartie",'value':"\""+name+"\""});
        if(idSystem!=null) arguments.push({'key':"idSysteme",'value':+idSystem});
        if(idCarte!=null) arguments.push({'key':"idCarte",'value':idCarte});
        if(fuseauHorraire!=null) arguments.push({'key':"fuseauHorraire",'value':fuseauHorraire});
        if(description!=null) arguments.push({'key':"DescriptionPartie",'value':"\""+description+"\""});

        let query = "";
        switch(processus){
            case "Create":
                query="INSERT INTO Partie (";
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
                query="UPDATE Partie SET ";
                for(i=0;i<arguments.length;i++){
                    if(i==0) query+=arguments[i].key+"="+arguments[i].value;
                    else query+=","+arguments[i].key+"="+arguments[i].value;
                }
                query+=" WHERE idPartie="+idPartie;
                break;
            case "Delete":
                query="DELETE FROM Partie WHERE idPartie="+idPartie;
                listeCaracteristique=[];
                break;
        }
        

        console.log("query : "+query);

        let res=await queryPartie(db,query);
        if(res.insertId!=0) idPartie=res.insertId;

        change_caracteristique(idPartie,listeCaracteristique);
    },
    /**
     * fonction qui récupère les identifiants des parties associées à un utilisateur
     * @param {* type } idUtilisateur identifiant de l'utilisateur courant
     */
    async partie_utilisateur(idUtilisateur){
        db = require("./DatabaseConnection.js").createConnection();

        

        let query = "SELECT idPartie FROM Joueur WHERE idUtilisateur="+idUtilisateur;
        console.log("query: "+query)

        const parties= await queryPartie(db,query);
        console.log(parties[0]);
        console.log("nbPartie: "+parties.length);
        
        return donnees_parties(parties);
        
    },
    /**
     * Récupère les identifiants et les pseudo des joueurs associés à une partie
     * @param { type } idPartie identifiant de la partie recherchée
     */
    async affiche_joueur(idPartie){
        db = require("./DatabaseConnection.js").createConnection();
        
        let query="SELECT idUtilisateur, pseudo FROM Joueur NATURAL JOIN Utilisateur WHERE idPartie = "+
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
    /**
     * Permet d'accepter un nouveau joueur dans la partie selectionnée
     * @param { type } idPartie identifiant de la partie selectionnée
     * @param { type } idUtilisateur identifiant du futur joueur
     */
    async accepte_joueur(idPartie,idUtilisateur){
        db = require("./DatabaseConnection.js").createConnection();
        
        let query="INSERT INTO Joueur(idPartie,idUtilisateur) VALUES ('"+idPartie+"','"+idUtilisateur+"')";
        console.log(query);

        await queryPartie(db,query);
    },
    /**
     * Permet de supprimer un joueur de la partie
     * @param { type } idPartie identifiant de la partie selectionnée
     * @param { type } idUtilisateur identifiant du joueur à supprimer
     */
    async supprime_joueur(idPartie,idUtilisateur){
        db = require("./DatabaseConnection.js").createConnection();
        
        let query="DELETE FROM Joueur WHERE idPartie="+idPartie+" AND idUtilisateur="+idUtilisateur;
        console.log(query);

        await queryPartie(db,query);
    },
    /**
     * Recupère toutes les caractéristiques associées aux parties
     */
    async recuperer_caracteristique(){
        db = require("./DatabaseConnection.js").createConnection();
        
        let query="SELECT * FROM Caracteristique WHERE typeCaracteristique='Partie'";
        console.log(query);

        const allcarac=await queryPartie(db,query);
        console.log(allcarac);

        let donnees=[]
        for(i=0;i<allcarac.length;i++){
            donnees.push({'idCaracteristique':allcarac[i].idCaracteristique,
                         'typeCaracteristique':allcarac[i].typeCaracteristique,
                         'valeurCaracteristique':allcarac[i].valeurCaracteristique});
        }

        console.log(donnees);
        return donnees;
    },
    /**
     * 
     * @param { type } input mots-clés recherchées
     * @param { type } recherche renseigne sur quel déterminant recherché. Peut être : Titre,
     *          Auteur, Description
     * @param { Array } carac tableau des caractéristiques de partie recherchées
     */
    async recherche_partie(input,recherche,carac){
        
        db = require("./DatabaseConnection.js").createConnection();
        
        queryInit="SELECT idPartie FROM Utilisateur NATURAL JOIN Partie NATURAL JOIN"+
                  " CaracteristiquePartie NATURAL JOIN Caracteristique WHERE idOrganisateur=idUtilisateur";
    

        //console.log("initialisation: "+queryInit);

        caracteristique_recherche="";
        if(carac.length>0){
            caracteristique_recherche=" OR ("
            for(i=0;i<carac.length;i++){
                if(i==0) caracteristique_recherche+="valeurCaracteristique='"+carac[i]+"'";
                else caracteristique_recherche+=" OR valeurCaracteristique='"+carac[i]+"'";
            }
            caracteristique_recherche+=")"
        }
        
        //console.log("caracteristique")

        queryWhere="";
        order="";
        if(input!=""){
            const mots_cle=input.split(" ");
            switch(recherche){
                case 'Titre':
                    queryWhere=" OR ("+traitement_input(mots_cle,"nomPartie")+")";
                    console.log(queryWhere);
                    order=" ORDER BY nomPartie";
                    break;
                case 'Auteur':
                    queryWhere=" OR ("+traitement_input(mots_cle,"pseudo")+")";
                    console.log(queryWhere);
                    order=" ORDER BY pseudo";
                    break;
                case 'Description':
                    queryWhere=" OR ("+traitement_input(mots_cle,"DescriptionPartie")+")";
                    console.log(queryWhere);
                    order=" ORDER BY DescriptionPartie";
                    break;
                default: console.log("Wesh mec, ca existe comme type de recherche");
            }
            
        }
        let query=queryInit+queryWhere+caracteristique_recherche+" GROUP BY idPartie "+order;
        console.log(query);
        
        const parties=await queryPartie(db,query);

        return await donnees_parties(parties);
    },
    /**
     * retourne un objet formatter représentant une partie
     * @param { type } idPartie identifiant de la partie recherchée
     */
    affiche_partie(idPartie){
        return donnees_parties([{'idPartie':idPartie}]); 
    },
    


}

/**
 * Fonction qui permet l'execution des requêtes vers la base
 * @param { Object } db connexion à la base de donnée
 * @param { type } query requete SQL
 */
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

/**
 * Retourne au format JSON les informations représentant la partie recherchée
 * @param { type } idPartie identifiant de la partie
 * @param { Object } infoPartie informations de la partie récupérées suite à la requête 
 *          sur la base
 * @param { Object } nbJoueur nombres de joueurs actuelles sur la parties
 * @param { Object } infoCarac informations sur les caractéristiques de la partie récupérées
 *          suite à la requête sur la base
 */
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

/**
 * Mise en forme de la partie recherche de mot-clé pour la requête de la recherche de parties
 * @param { type } input mots-clés de la recherche de partie 
 * @param { type } type déterminant de la recherche
 */
function traitement_input(input,type){
    output=" ";
    for(i=0;i<input.length;i++){
        if(i==0) output+=type+" LIKE '%"+input[i]+"%'";
        else output+=" OR "+type+" LIKE '%"+input[i]+"%'";
    }
    return output;
}

/**
 * 
 * @param { Array } parties liste des parties dont on veut récupérer et formatter les données
 */
async function donnees_parties(parties){

    db = require("./DatabaseConnection.js").createConnection();
    
    let donnees=[]
    for(i=0;i<parties.length;i++){
        
        partie=parties[i].idPartie
        console.log("idPartieActuelle="+partie)

        let query = "SELECT nomPartie, pseudo, nomSysteme, fuseauHorraire, DescriptionPartie, nomCarte, dateCréationPartie as dateCreationPartie "+
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
    return donnees;
}

/**
 * Modifie dans la base les caractéristiques liées à une partie. Supprime puis réinsére les
 * caractéristiques à garder
 * @param { type } idPartie identifiant de la partie
 * @param { Array } listeCaracteristique liste des identifiants de caractéristique à garder.
 *  Si le tableau est vide, alors la fonction supprime toutes les caractéristiques lié à la partie 
 */
async function change_caracteristique(idPartie,listeCaracteristique){
    
    db = require("./DatabaseConnection.js").createConnection();

    let query="DELETE FROM CaracteristiquePartie WHERE idPartie="+idPartie;
    console.log(query);
    await queryPartie(db,query);

    for(i=0;i<listeCaracteristique.length;i++){
        query="INSERT INTO CaracteristiquePartie (idPartie,idCaracteristique) VALUES ("+idPartie+","+
                listeCaracteristique[i]+")";
        console.log(query);
        await queryPartie(db,query);
    }
    

}