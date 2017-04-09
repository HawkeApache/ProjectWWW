var fs = require('fs');
var http = require('http');
var url = require('url');
var request = require('request');
var cheerio = require('cheerio');

function getMovie(req, res) {
    var json = '';

    req.on('data', function (data) {
        json += data;
        if (json.length > 1e6)
            request.connection.destroy();
    });

    req.on('end', function () {
        var url = JSON.parse(json).URL;
        request(url, function (error, response, html) {
            if (!error) {
                var $ = cheerio.load(html); //sparsowany html w drzewo

                var json = {title: "", release: "", rating: ""};

                var buf = fs.readFileSync('./config.json');
                this.title = JSON.parse(buf.toString()).title;
                this.release = JSON.parse(buf.toString()).release;
                this.rating = JSON.parse(buf.toString()).rating;

                $(this.title).filter(function () { //tytuł bez roku
                    var data = $(this);
                    json.title = data.text().split("(")[0];
                });

                $(this.release).filter(function () { //rok
                    var data = $(this);
                    json.release = data.text();
                });

                $(this.rating).filter(function () { //ratind
                    var data = $(this);
                    json.rating = data.text();
                });

                res.end(JSON.stringify(json));
                console.log(json);
            }
        });
    });
}

function getActor(req, res) {
    var json = '';

    req.on('data', function (data) {
        json += data;
        if (json.length > 1e6)
            request.connection.destroy();
    });

    req.on('end', function () {
        var url = JSON.parse(json).URL;
        request(url, function (error, response, html) {
            if (!error) {
                var $ = cheerio.load(html); //sparsowany html w drzewo

                var json = {title: "", release: "", rating: ""};

                var buf = fs.readFileSync('./config.json');
                this.title = JSON.parse(buf.toString()).title;
                this.release = JSON.parse(buf.toString()).release;
                this.rating = JSON.parse(buf.toString()).rating;

                $(this.title).filter(function () { //tytuł bez roku
                    var data = $(this);
                    json.title = data.text().split("(")[0];
                });

                res.end(JSON.stringify({"actor":"actorka"}));
                console.log(json);
            }
        });
    });
}


function requestHandler(request, response) {
    switch (request.method) {
        case 'GET':
            if (request.url.toString() === '/movie') {
                getMovie(request, response);
            }
            else if(request.url.toString() === '/actor'){
                getActor(request, response);
            }
            else {
                console.log("hwdp");
            }
            break;

        default:
            console.log("METODA NIE OBSŁUŻONA");
    }
}

var server = http.createServer(requestHandler);

server.listen(3000, function () {
    console.log("server started");
});