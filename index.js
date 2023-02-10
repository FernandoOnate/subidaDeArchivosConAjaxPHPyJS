window.addEventListener('load', function (e) {
    const form = document.querySelector('form');
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(form);
        const files = form.querySelector('[type="file"]').files;
        const promises = [];
        // let blobs = [];
        for (let file of files) {
            promises.push(new Promise(function (resolve, reject) {
                new Compressor(file, {
                    quality: 0.8,
                    success(result) {
                        formData.append('files', result, result.name);
                        
                        const request = new XMLHttpRequest();
                        request.open("POST", "./files-handler.php");
                        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                        request.send(formData);
                        request.onreadystatechange = (e) => {
                            if (request.status == 200 && request.readyState == 4) {
                                msg('Conexion lista', request.responseText, true);
                                // console.log('listos')
                            }
                        }
                        resolve(result);
                    },
                    error(err) { console.log(err.message); reject('Promesa no resuelta'); },
                })
            }))
        }

        // (async function() {
        //     for (let i = 0; i < promises.length; i++) {
        //         await promises[i].then((result) => {
        //             blobs.push(result);
        //         }).catch((err) => {
        //             console.log(err);
        //         })
        //     }
        // })()
        // console.log(blobs)
    })
})
function msg(titulo, mensaje, closeOn) {
    $.toast({
        title: titulo,
        message: mensaje,
        // showProgress: 'bottom',
        closeOnClick: closeOn,
        classProgress: 'green',
        class: 'white'
    });
}