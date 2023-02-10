window.addEventListener('load', function () {

    const form = document.querySelector('form');

    form.addEventListener('submit', e => {

        e.preventDefault();
        const files = form.querySelector('input[type="file"]').files;
        let archivosBlob = [];

        for (let file of files) {
            new Compressor(file, {
                quality: 0.6,
                success(result) {
                    archivosBlob.push(result);
                    if (archivosBlob.length === files.length) {
                        subirArchivos(archivosBlob);
                    }
                }
            })
        }
        // mando los archivos a php
        function subirArchivos(blobArray) {

            const formData = new FormData();
            blobArray.forEach(blobFile => {
                formData.append('files[]', new File([blobFile], blobFile.name));
            });

            const request = new XMLHttpRequest();
            request.open('POST', './files-handler.php', true);
            request.onreadystatechange = function () {
                if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                    getImages();
                    let text = JSON.parse(this.responseText).message;
                    msg('EXITO!', text, false);
                }
            }
            request.send(formData);
            e.target.reset();

        }
    })
    function getImages() {
        const request = new XMLHttpRequest();

        request.open('GET', 'get_files.php', true);

        request.onreadystatechange = function () {
            if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {

                let response = JSON.parse(request.responseText);
                let imageList = document.getElementById('image-container');

                for (let i = 0; i < response.length; i++) {
                    let fileItem = document.createElement('img');
                    fileItem.src = './uploads/' + response[i];
                    imageList.appendChild(fileItem);
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
        classProgress: 'red',
        class: 'success center aligned',
        className: {
            toast: 'ui message'
        }
    });
}