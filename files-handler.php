<?php

function adaptativeResponse($success, $msg)
{
    header('Content-Type: application/json; charset-utf-8');
    $json = ['success' => $success, 'message' => $msg];
    return $json;
}

function moveImage()
{
    if (isset($_FILES['files'])) {
        $err = 0;
        $message = '';
        $files_input = $_FILES['files'];
        $uploadDir = __DIR__ . '\uploads\ ';
        $extentions_allowed = array('jpeg', 'jpg');

        foreach ($files_input['error'] as $key => $error) {

            if ($error  == UPLOAD_ERR_OK) {

                $tmp_name = $files_input['tmp_name'][$key];
                $file_name = $files_input['name'][$key];
                $file_extention = pathinfo($file_name, PATHINFO_EXTENSION);
                $toPath = $uploadDir . uniqid() . '_' . $file_name;

                if (!in_array($file_extention, $extentions_allowed)) {
                    $message = 'El formato no es JPG!';
                    $err = 1;
                }

                if(move_uploaded_file($tmp_name, $toPath)){
                    $message = 'La operación resultó exitosa.';
                }else{
                    $message = 'Error al subir la foto';
                    $err = 2;
                }
            }
        }
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
