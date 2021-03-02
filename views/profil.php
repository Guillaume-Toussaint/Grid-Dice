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
        <?php include ("navbar.php") ?>

        <!-- Acceuil-->
        <div style="background-color: red;">

            <!-- Navbar Profil/Contact-->
            <nav class="navbar navbar-light bg-light">
                <div class="navbar-nav">
                    <a class="nav-link active" aria-current="page" href="Profil.php">Profil</a>
                    <a class="nav-link" href="contact.ejs">Contact</a>
                </div>
            </nav>

            <!-- Card profil-->
            <div>
              <div class="card" style="width: 18rem;">
                  <div class="card-body">
                    <h5 class="card-title">Castel Or-Azur</h5>
                    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    <p>1</p>
                    <i class="bi bi-person-fill"></i>
                    <button type="button" class="btn btn-primary">Rejoindre</button>
                  </div>
               </div>

               <button type="button" class="btn btn-primary">cree une partie</button>
            </div>
        </div>
    </body>
</html>