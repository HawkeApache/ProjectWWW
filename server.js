var http = require('http');
var url = require('url');
var fs = require('fs');
var shortid = require('shortid');


function post(request, response) {
    var person = '';

    request.on('data', function (data) {
        person += data;
        if (person.length > 1e6)
            request.connection.destroy();
    });

    request.on('end', function () {
        var id = shortid.generate();
        fs.readFile('users.json', 'utf8', function readFileCallback(err, database){
            if (err) {
                console.log(err);
            } else {
                databaseObject = JSON.parse(database); //now it an object
                personObject = JSON.parse(person);
                databaseObject[id] = personObject;
                personJSON = JSON.stringify(databaseObject); //convert it back to json
                fs.writeFile('users.json', personJSON, function (err) {
                    if (err) throw err;
                });
            }});
        response.end("Dodano rekord, id rekordu: "+id);
    });
}

function get(request, response) {
    path = request.url.toString();

    fileName = path.split('/')[1];
    fileName = fileName + '.json';

    fs.readFile(fileName, 'utf8', function readFileCallback(err, database){
        if (err) {//nie ma takiej tabeli
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.write("404 Not found");
            response.end();
        } else {//jest tabela
            databaseObject = JSON.parse(database); //now it an object
            if(databaseObject[path.split('/')[2]]!==undefined){//znalezione po id
                response.end(JSON.stringify(databaseObject[path.split('/')[2]]));
            }else{//nie znalezione po id
                if(path.split('/').length === 3){//bylo podane bledne id i tylko tyle
                    response.writeHead(300, {"Content-Type": "text/plain"});
                    response.write("300 Object not found");
                    response.end();
                }else{//szuka po innej wartosci
                    var founded = undefined;
                    var keys = Object.keys(databaseObject);
                    var subkey = path.split('/')[2];
                    var value = path.split('/')[3];

                    for(var index in keys){
                        var key = keys[index];
                        var person = databaseObject[key];
                        if(person[subkey] === value){
                            founded = JSON.stringify(person);
                        }
                    }
                    if(founded === undefined){
                        response.end("brak rekordów");
                    }else{
                        response.end(founded.toString());
                    }
                }
            }
        }
    });
}

function del(request, response) {
    path = request.url.toString();

    fileName = path.split('/')[1];
    fileName = fileName + '.json';

    fs.readFile(fileName, 'utf8', function readFileCallback(err, database) {
        if (err) {//nie ma takiej tabeli
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.write("404 Not found");
            response.end();
        } else {//jest tabela
            databaseObject = JSON.parse(database); //now it an object
            if (databaseObject[path.split('/')[2]] !== undefined) {//znalezione po id
                response.end(JSON.stringify(databaseObject[path.split('/')[2]]));
                delete databaseObject[path.split('/')[2]];
                personJSON = JSON.stringify(databaseObject); //convert it back to json
                fs.writeFile('users.json', personJSON, function (err) {
                    if (err) throw err;
                });
            } else {
                response.end("brak rekordów");
            }
        }
    })
}

function requestHandler(request, response) {
    switch (request.method) {
        case 'POST':
            //todo: request. cos
            post(request, response);
            break;
        case 'GET':
            get(request,response);
            break;
        case 'DELETE':
            del(request, response);
            break;
    }
}

var server = http.createServer(requestHandler);

server.listen(3000, function () {
   console.log("server started");
});