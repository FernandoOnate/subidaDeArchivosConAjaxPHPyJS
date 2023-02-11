const form = document.querySelector('form');

const imageContainer = document.getElementById('image-container');
const emptyImagesMessage = document.getElementById('msg');
const titulo = document.getElementById('titulo');
const rute = './uploads/';

let resultsPHP = [];

window.addEventListener('load', function () {

    getImages();

    form.addEventListener('submit', ev => {

        ev.preventDefault();
        const files = form.querySelector('input[type="file"]').files;
        let promises = [];
        // PUSHEAR LAS PROMESAS AL ARRAY PROMISES
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
        // RESUELVO LAS PROMESAS
        Promise.all(promises)
            .then(
                results => subirArchivos(results)
            )
            .catch(
                err => console.log(err)
            );

    });
})
// compara los datos en la carpeta vs el nuevo archivo para solo agregar 1 elemnto html
function pushNewImages(phpNewData, newData) {
    let dataReversed = [...phpNewData].reverse();
    let emptyMessage = emptyImagesMessage.innerHTML;
    let title = titulo.innerHTML;
    if (emptyMessage.length) {
        emptyImagesMessage.innerHTML = '';
    }
    if (!title.length) {
        titulo.innerHTML = 'Aquí tienes las imágenes que subiste.';
    }
    for (let i = 0; i < newData.length; i++) {
        const newImg = new Image();
        newImg.src = rute + dataReversed[i];
        imageContainer.appendChild(newImg);
    }
}
// mandar los archivos a php
function subirArchivos(blobArray) {
    let png = false;
    // verifico que la extension sea jpg
    for (let index in blobArray) {
        let ext = blobArray[index].name.split('.')[1];
        if (ext == 'jpg') {
            continue;
        }
        png = true;
    }
    // si es jpg continua
    if (!png) {
        const formData = new FormData();

        blobArray.forEach(blobFile => {
            formData.append('files[]', new File([blobFile], blobFile.name));
        });

        const request = new XMLHttpRequest();
        request.open('POST', './files-handler.php', true);

        request.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let message = JSON.parse(this.responseText).message;
                let success = JSON.parse(this.responseText).success;
                if (success) {
                    form.reset();
                    msg('EXITO!', message, false);
                    getNewImages(blobArray);
                } else {
                    msgError('ERROR!', message, false);
                }
            }
        }
        request.send(formData);
    } else {
        msgError('ERROR', 'TODOS tienen que ser JPG');
    }
}
// get new dada
function getNewImages(newData) {
    const request = new XMLHttpRequest();

    request.open('GET', 'list.php', true);

    request.onreadystatechange = async function () {
        if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {

            const response = await JSON.parse(request.responseText);

            if (response.length > 0) {
                // titulo.innerHTML = 'Aquí tienes las imágenes que subiste.';
                // emptyImagesMessage.innerHTML = '';
                for (let i = 0; i < response.length; i++) {
                    resultsPHP[i] = (response[i]);
                }
                pushNewImages(resultsPHP, newData);
            } else {
                // emptyImagesMessage.innerHTML = 'No hay imágenes en el directorio, intenta subir alguna.';
            }
        }

    };
    request.send();
}
// OBTENER LAS IMAGENES DEL DIRECTORIO
function getImages() {
    const request = new XMLHttpRequest();

    request.open('GET', 'list.php', true);

    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {

            const response = JSON.parse(request.responseText);

            if (response.length > 0) {
                titulo.innerHTML = 'Aquí tienes las imágenes que subiste.';
                emptyImagesMessage.innerHTML = '';
                for (let i = 0; i < response.length; i++) {
                    const newImg = new Image();
                    newImg.src = rute + response[i];
                    imageContainer.appendChild(newImg);
                }
            } else {
                emptyImagesMessage.innerHTML = 'No hay imágenes en el directorio, intenta subir alguna.';
            }
        }
    };
    request.send();
}

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