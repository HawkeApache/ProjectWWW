var http = require('http');
var url = require('url');

// var users = JSON.parse({'pe':{}});

function post(reqest, response) {
    response.end("POSTT nowy");
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