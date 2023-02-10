<?php 
    $gestor = opendir(__DIR__ . '\uploads\ ');
    if($gestor):
        while(($imagen = readdir($gestor)) != false):
            if($imagen != '..' and $imagen !='.'):
                echo "<img src='./images/$imagen' width = '300px'/><br/>";
            endif;
        endwhile;
    endif;