<!DOCTYPE html>

<html lang="fr" >
    <head>
    <meta charset="utf-8" />
    <title>Acceuil</title>

    <script
                src="https://code.jquery.com/jquery-2.2.4.min.js"
                integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44="
                crossorigin="anonymous"></script>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css">
    <link rel="stylesheet" type="text/css" href="../style.css">
    </head>
    <body>
        <!--Navbar lien-->
        <?php include ("navbar.php") ?>

        <!-- Acceuil-->
        <div style="background-color: red;">
            <button type="button" class="btn btn-primary">Rechercher une partie</button>
            <button type="button" class="btn btn-primary">Acceder au flux</button>

            <div><!-- Acces aux parties en cours-->
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