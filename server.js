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
            if (err){
                console.log(err);
            } else {
                databaseObject = JSON.parse(database); //now it an object
                personObject = JSON.parse(person);
                databaseObject[id] = personObject;
                personJSON = JSON.stringify(databaseObject); //convert it back to json
                fs.writeFile('users.json',personJSON,function(err){
                    if(err) throw err;
                }); // write it back
            }});
        response.end("Dodano rekord, id rekordu: "+id);
    });
}

function get(request, response) {
    response.end("get nowy");
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
        default:
            response.end("działa");
            break;
    }
}

var server = http.createServer(requestHandler);

server.listen(3000, function () {
   console.log("server started");
});