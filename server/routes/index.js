var fs = require('fs'), //Herramientas para manejo de archivos
    path = require('path'), //Herramientas para manejo de carpetas
    url = require('url'), //Herramientas para manejo de urls
    routes = require('./routes.json'); //Carga el archivo routes.json, donde se definen las urls disponibles


//CARGAR PARTIALS
module.exports = function (req, res) {
    // Parsea la url para obtener el nombre del menu 
    pathname = url.parse(req.url).pathname;
    var aux = '';
    //Recorre el archivo json 
    for (i in routes) {
        //Recorre los distintos menus definidos
        for (j in routes[i]) {
            //Compara el menú actual con la url obtenido
            if (pathname === routes[i][j].route) {
                aux = i;
            }
        }
    }
    if (fs.statSync(path.join(process.cwd(), '/apps/' + aux)).isDirectory() == true) { //checking if search result is a directory
        var apps = require(path.join(process.cwd(), '/apps/' + aux))(req, res); //call index.js in folder result 
    }
}
