var http = require('http');
var url = require('url');

// var users = JSON.parse({'pe':{}});

function requestHandler(request, response) {
    switch (request.method) {
        case 'POST':
            //todo: request. cos
            request.
            console.log(request);
            response.end("POSTT");
            break;
        case 'GET':
            var uri = request.url.toString();

            response.end(uri);
            break;
        default:
            response.end("działa");
    }
}

var server = http.createServer(requestHandler);

server.listen(3000, function () {
   console.log("server started");
});