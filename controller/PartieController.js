const { query } = require("express");

module.exports = {


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
        }
        

        console.log("query : "+query);

        let res=await queryPartie(db,query);
        if(res.insertId!=0) idPartie=res.insertId;

        change_caracteristique(idPartie,listeCaracteristique);
    },
    async partie_utilisateur(idUtilisateur){
        db = require("./DatabaseConnection.js").createConnection();

        

        let query = "SELECT idPartie FROM Joueur WHERE idUtilisateur="+idUtilisateur;
        console.log("query: "+query)

        const parties= await queryPartie(db,query);
        console.log(parties[0]);
        console.log("nbPartie: "+parties.length);
        
        return donnees_parties(parties);
        
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
        
        query="SELECT * FROM Caracteristique WHERE typeCaracteristique='Partie'";
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
        query=queryInit+queryWhere+caracteristique_recherche+" GROUP BY idPartie "+order;
        console.log(query);
        
        const parties=await queryPartie(db,query);

        return await donnees_parties(parties);
    },
    affiche_partie(idPartie){
        return donnees_parties([{'idPartie':idPartie}]); 
    },
    


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

function traitement_input(input,type){
    output=" ";
    for(i=0;i<input.length;i++){
        if(i==0) output+=type+" LIKE '%"+input[i]+"%'";
        else output+=" OR "+type+" LIKE '%"+input[i]+"%'";
    }
    return output;
}

async function donnees_parties(parties){

    db = require("./DatabaseConnection.js").createConnection();
    
    let donnees=[]
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
    return donnees;
}


async function change_caracteristique(idPartie,listeCaracteristique){
    
    db = require("./DatabaseConnection.js").createConnection();

    console.log("la ca vient de change_caracteristique")
    await queryPartie(db,"SELECT * FROM Partie WHERE idPartie="+idPartie);

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