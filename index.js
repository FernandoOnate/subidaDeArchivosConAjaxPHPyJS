window.addEventListener('load', function () {

    const form = document.querySelector('form');

    form.addEventListener('submit', e => {

        e.preventDefault();
        const files = form.querySelector('input[type="file"]').files;

        let promises = [];

        for (let file of files) {
            promises.push(new Promise((resolve, reject) => {
                new Compressor(file, {
                    quality: 0.6,
                    success(result) {
                        resolve(result);
                    }, error(e) {
                        reject(e);
                    }
                })
            }))
        }
        // RESUELVO LAS PROMESAS CON UNA FUNCION ANONIMAS
        Promise.all(promises)
            .then(
                results => subirArchivos(results)
            )
            .catch(
                e => console.log(e)
            );

        // mandar los archivos a php
        function subirArchivos(blobArray) {
            let png = false;
            for (let index in blobArray) {
                let ext = blobArray[index].name.split('.')[1];
                if (ext == 'jpg') {
                    continue;
                }
                png = true;
            }
            if (!png) {
                const formData = new FormData();

                blobArray.forEach(blobFile => {
                    formData.append('files[]', new File([blobFile], blobFile.name));
                });

                // formData.append('files[]', new File([blobFile], blobFile.name));
                const request = new XMLHttpRequest();
                request.open('POST', './files-handler.php', true);
                request.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        let message = JSON.parse(this.responseText).message;
                        let success = JSON.parse(this.responseText).success;
                        if (success) {
                            msg('EXITO!', message, false);
                            getImages();
                        } else {
                            msgError('ERROR!', message, false);
                        }
                    }
                }
                request.send(formData);
                e.target.reset();
            } else {
                msgError('ERROR', 'TODOS tienen que ser JPG');
            }

        }
    })
    // OBTENER LAS IMAGENES DEL DIRECTORIO
    function getImages() {
        const request = new XMLHttpRequest();

        request.open('GET', 'list.php', true);

        request.onreadystatechange = function () {
            if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {

                let response = JSON.parse(request.responseText);
                let imageList = document.getElementById('image-container');
                let msg = document.getElementById('msg');
                let titulo = document.getElementById('titulo');

                if (response.length > 0) {
                    titulo.innerHTML = 'Aquí tienes las imágenes que subiste.';
                    for (let i = 0; i < response.length; i++) {
                        msg.innerHTML = '';
                        let fileItem = document.createElement('img');
                        fileItem.src = './uploads/' + response[i];
                        imageList.appendChild(fileItem);
                    }
                } else {
                    msg.innerHTML = 'No hay imágenes en el directorio, intenta subir alguna.';
                }
            }
        };
        request.send();
    }
    getImages();
})

// mensaje para las alertas
function msg(titulo, mensaje, closeOn) {
    $.toast({
        title: titulo,
        displayTime: 8000,
        message: mensaje,
        showProgress: 'bottom',
        closeOnClick: closeOn,
        classProgress: 'green',
        class: 'success center aligned',
        className: {
            toast: 'ui message'
        }
    });
}
function msgError(titulo, mensaje, closeOn) {
    $.toast({
        title: titulo,
        displayTime: 8000,
        message: mensaje,
        showProgress: 'bottom',
        closeOnClick: closeOn,
        classProgress: 'red',
        class: 'error center aligned',
        className: {
            toast: 'ui message'
        }
    });
}