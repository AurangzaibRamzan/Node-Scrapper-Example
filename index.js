var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.get('/scrape', function (req, res) {
  var url = 'http://m.imdb.com/chart/moviemeter/';
  var topMovieListName = [];
  //All the web scraping magic will happen here

  // First we'll check to make sure no errors occurred when making the request

  request(url, function (error, response, html) {
    if (!error) {
      var $ = cheerio.load(html);

      // We'll use the unique  class as a starting point.

      $('.media-body').filter(function () {

        // Let's store the data we filter into a variable so we can easily see what's going on.

        var data = $(this);

        // In examining the DOM we notice that the title rests within the first child element of the header tag. 
        // Utilizing jQuery we can easily navigate and get the text by writing the following code:
        if (typeof data.children().first().text()) {
          topMovieListName.push(
            {
              title: data.children().first().text().replace(/\n/g, ''),
              rating: data.children().next().text().replace(/\n/g, ''),
              Imbd: data.children().last().text().replace(/\n/g, ''),
            })
        }
        // // Once we have our title, we'll store it to the our json object.
      });

      fs.writeFile('topmovieList.json', JSON.stringify(topMovieListName), 'utf8', () => {
        res.status(200).send('done data Store in topmovieList.json file');
      });
    }
    else {
      return res.send(`error ${error}`);
    }
  })
})

app.listen('8081')

console.log('Magic happens on port 8081');

exports = module.exports = app;