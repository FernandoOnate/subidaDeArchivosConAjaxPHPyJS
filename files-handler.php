<?php

function adaptativeResponse($success, $msg, $error)
{
    header('Content-Type: application/json; charset-utf-8');
    $json = ['success' => $success, 'message' => $msg, 'error' => $error];
    return $json;
}

function moveImage()
{
    $err = '';
    $message = '';

    $uploadDir = __DIR__ . '\uploads\ ';
    
    $filesInput = $_FILES['files'];

    $filesName = $filesInput['name'];
    $filesTmpName = $filesInput['tmp_name'];
    $filesError = $filesInput['error'];
    $tipo = $filesInput['type'];

    if (isset($filesInput)) {
        foreach ($filesName as $key => $value) {

            if ($filesError[$key] == UPLOAD_ERR_OK) {

                $toPath = $uploadDir . uniqid() . '_' . $value;

                if ($tipo[$key] == 'image/jpeg' or $tipo[$key] == 'image/jpg') {
                    $uploaded = move_uploaded_file($filesTmpName[$key], $toPath);
                    $message = 'Imágen (es) subida (s) con éxito.!';
                    $err = 'SUCCESS';
                } else {
                    //    INCORRECTA SUBIDA
                    $err = 'No es .jpg';
                    $message = 'Tipo de imágen no compatible con: JPG.';
                }
            } else {
                // echo '<strong>Hubo errores</strong>';
                $message = 'Error inesperado al subir.';
                $err = 'unexpected';
            }
        }
    } else {
        $err = 'No inputs';
        $message = 'No existe files input';
    }

    if ($err === 'SUCCESS') {
        return json_encode(adaptativeResponse(true, $message, $err), JSON_UNESCAPED_UNICODE);
        die();
    } else {
        return json_encode(adaptativeResponse(false, $message, $err), JSON_UNESCAPED_UNICODE);
        die();
    }
}
$response = moveImage();
echo $response;
