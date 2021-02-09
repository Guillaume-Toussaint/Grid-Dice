<nav id="nav" class="navbar is-dark" role="navigation" aria-label="main navigation">



        <!-- start logo-->
        <div class="navbar-brand">
            <a class="navbar-item" href="index.php">
                <!-- lien-->
                <img src="../Images/logo_gourmeez_png.png" width="112" height="28">
            </a>

            <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>
        <!-- end logo -->

        <!-- start menu-->
        <div id="navbarBasicExample" class="navbar-menu">
            <div class="navbar-start">
                <a class="navbar-item">
                    Concept
                </a>

                <a class="navbar-item">
                    Equipe
                </a>

                <a class="navbar-item">
                    Contact
                </a>
            </div>
            <!-- end menu-->

            <div class="navbar-end">
                <div class="navbar-item">
                    <div class="buttons">

                        <?php if(isset($_SESSION["ID_user"])){ ?>

                            <a class="button is-danger is-inverted is-rounded" onClick="openModal('profil')">
                                <strong>Profil</strong>
                            </a>
                            <!--Start Modal Profil-->
                        <!-- lien-->
                            <?php include("UtilisateurConnecter/profil/profil2.php"); ?>
                            <!--end Modal Profil-->

                            <!-- lien-->
                            <a class="button is-danger is-inverted is-rounded" href="Navbar/UtilisateurConnecter/deconnection.php"><strong>Deconnexion</strong></a>

                        <?php }else{ ?>

                            <a class="button is-danger is-inverted is-rounded" onClick="openModal('inscription')">
                                <strong>S'incrire</strong>
                            </a>
                            <!--Start Modal inscription-->
                        <!-- lien-->
                            <?php include("UtilisateurDeconnecter/Modal_Inscription.php"); ?>
                            <!--end pop up inscription-->

                            <a class="button is-danger is-rounded " onClick="openModal('connection')">
                                <strong>Se connecter</strong>
                            </a>
                            <!--Start Modal connection-->
                        <!-- lien-->
                            <?php include("UtilisateurDeconnecter/ModalConnexion.php"); ?>
                            <!--end pop up connection-->

                        <?php } ?>


                    </div>
                </div>
            </div>
        </div>
    </nav>