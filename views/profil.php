<!DOCTYPE html>

<html lang="fr" >
    <head>
    <meta charset="utf-8" />
    <title>Profil</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css">
    </head>
    <body>
        <!--Navbar lien-->
          <%- include('navbar.ejs'); %>

        <!-- Acceuil-->
        <div>

            <!-- Navbar Profil/Contact-->
            <nav class="navbar navbar-light bg-light">
                <div class="navbar-nav">
                    <a class="nav-link active" aria-current="page" href="Profil.php">Profil</a>
                    <a class="nav-link" href="contact.ejs">Contact</a>
                </div>
            </nav>

            <!-- Card profil-->
            <div>
                <h5>Nom utilisateur</h5>
                <p>gaspard</p>

                <h5>Pays</h5>
                <p>france</p>

                <h5>Fuseau horaire</h5>
                <p>GTM + 1</p>

                <h5>Description</h5>
                <p>un juour qui a tu les jeux fpezkf^pzkef^pzkef^pzkef^pkezf^pkzefpkzf^pz</p>
            </div>

            <div>
                <h5>preference de jeu</h5>
                <div>
                    <div>
                        <p>Niveu de jeu</p>
                        <ul>
                            <li>novice</li>
                            <li>moyenne</li>
                            <li>complexe</li>
                        </ul>
                    </div>
                    <div>
                        <p>genre</p>
                        <ul>
                            <li>Cyberpunk</li>
                            <li>Fantasy</li>
                            <li>Post-apo</li>
                        </ul>
                    </div>
                </div>
                <div>
                    <div>
                        <p>Systeme de preference</p>
                        <ul>
                            <li>D&D 5e</li>
                            <li>l'appele de chtulu</li>
                        </ul>
                    </div>
                    <div>
                        <p>Meta</p>
                        <ul>
                            <li>Accepte les nouveaux joueurs</li>
                            <li>Partie serieuse</li>
                        </ul>
                    </div>
                </div>
            </div>

        </div>
    </body>
</html>
