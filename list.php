<?php
function getImages()
{
  $response = array();
  $errors = array();
  $uploadFolder =  __DIR__ . '/uploads/';
  $extentions_allowed = array('jpeg', 'jpg');
  $counter_errors = 0;
  header('Content-Type: application/json; charset-utf-8');

  if ($gestor = opendir($uploadFolder)) {
    // $cont = 0;
    while (($imagen = readdir($gestor)) !== false) {

      if ($imagen != '.' && $imagen != '..' && $imagen != '.keep') {

        $file_extention = pathinfo($imagen, PATHINFO_EXTENSION);

        if (!in_array($file_extention, $extentions_allowed)) {
          array_push($errors, ['File extension is not JPG or JPEG']);
          $counter_errors++;
        } else {
          array_push($response, $imagen);
        }
      } else {
        $counter_errors++;
      }
    }
    closedir($gestor);
  }

  if ($counter_errors > 0 && count($response) == 0) {
    array_push($errors, 'No files in directory');
  } else {
    array_push($response);
  }
  return json_encode($response, JSON_UNESCAPED_UNICODE);
}

$response = getImages();
echo $response;
