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

        $('.title_wrapper:not(#titleYear)').filter(function () { //tytuł bez roku
            var data = $(this);
            title = data.text();
//title = data.children.remove.end.text.trim
            json.title = title;

        });

        $('.title_wrapper h1 a').filter(function () { //rok
            var data = $(this);
            release = data.text();

            json.release = release;
        });

        $('.ratingValue :nth-child(1)').filter(function () { //ratind
            var data = $(this);

            rating = data.text();

            json.rating = rating;
        })


        console.log(json);
    }
})