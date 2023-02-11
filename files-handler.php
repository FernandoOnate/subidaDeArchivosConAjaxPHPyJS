<?php

function adaptativeResponse($success, $msg)
{
    header('Content-Type: application/json; charset-utf-8');
    $json = ['success' => $success, 'message' => $msg];
    return $json;
}

function moveImage()
{
    $message = '';
    if (isset($_FILES['files'])) {
        $err = 0;
        $files_input = $_FILES['files'];
        $uploadDir = __DIR__ . "/uploads/";
        $extentions_allowed = array('jpeg', 'jpg');

        foreach ($files_input['error'] as $key => $error) {

            if ($error  == UPLOAD_ERR_OK) {

                $tmp_name = $files_input['tmp_name'][$key];
                $file_name = $files_input['name'][$key];
                $file_extention = pathinfo($file_name, PATHINFO_EXTENSION);
                $toPath = $uploadDir . uniqid() . '@' . $file_name;

                if (in_array($file_extention, $extentions_allowed)) {
                    if (move_uploaded_file($tmp_name, $toPath) and $err == 0) {
                        $message = 'La operación resultó exitosa.';
                    } else {
                        $message = 'Error al subir la foto';
                        $err = 2;
                    }
                } else {
                    $message = '¡El formato no es JPG!';
                    $err = 1;
                }
            } else {
                $err = 3;
                $message = 'Error al subir.';
            }
        }
    } else {
        $err = 4;
        $message = 'Faltan los archivos';
    }

    if ($err > 0) {
        return json_encode(adaptativeResponse(false, $message), JSON_UNESCAPED_UNICODE);
        die();
    } else {
        return json_encode(adaptativeResponse(true, $message), JSON_UNESCAPED_UNICODE);
        die();
    }
}
$response = moveImage();
echo $response;
