var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

url = 'http://www.imdb.com/title/tt0050083/?ref_=nv_sr_1';

request(url, function (error, response, html) {
    if (!error) {
        var $ = cheerio.load(html); //sparsowany html w drzewo

        var title, release, rating;
        var json = {title: "", release: "", rating: ""};

        //plik oknfiguracyjny json
        /*{
            "titel": "title rwapper h1 ... text"
          }*/

        //css3 selector api
        //"a h1"
        //" .klasa h1"
        //#id h1

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


        console.log(json);
    }
});