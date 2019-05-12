

window.onload = function() {
    if (process && process.title === 'node') {
        var AdmZip = require('adm-zip');
        var http = require('http');
        var fs = require('fs');

        var download = function(url, dest, cb) {
        var file = fs.createWriteStream(dest);
        http.get(url, function(response) {
            response.pipe(file);
            file.on('finish', function() {
                file.close(cb); 
            });
        });
        }

        var unzip = function() {
             // reading archives
            var zip = new AdmZip("./my_file.zip");
            
        }

        download('desktop.zip', 'build.zip', unzip);
    } else {
        console.log("Running web version");
    }
}
