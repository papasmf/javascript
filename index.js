const express = require('express');
const bodyParser = require("body-parser");
const https = require('https');
const htmlparser = require("htmlparser2");
const cheerio = require('cheerio');
var fs = require('fs');
const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.set('view engine', 'pug');
app.set('views', './views');

app.get('/', function(req, res){
    res.send('Index');
});
app.get('/hello', function(req, res){
    res.render('hello');
});
app.get('/attributes', function(req, res){
    res.render('attributes');
});
app.get('/translate', function(req, res){
    res.render('translate', {var1:Date(), var2:'abcd'});
});
app.post("/translate", function(req, res)
{
    var inputtext = req.body.inputtext;

    var url = 'https://translate.google.co.kr/?hl=ko#en/ko/' + inputtext
    // self.driver.back()
    // self.driver.get(url)
    // time.sleep(3)
    // html = self.driver.page_source
    // soup = BeautifulSoup(html, 'html.parser')
    // upcoming_events_div = soup.find(id='result_box')
    // return upcoming_events_div.text

    https.get(url, function (res) {
        //setTimeout(myFunc, 1500, 'funky');
        console.log('on http');
        console.log("Got response: " + res.statusCode);

        setInterval(function() {
            let data = '';
            // A chunk of data has been recieved.
            res.on('data', function (chunk) {
                data += chunk;
            });
            // The whole response has been received. Print out the result.
            res.on('end', function () {
                // var parse = JSON.parse(data);
                // console.log(parse);
                var $ = cheerio.load(data);
                var r = $('#result_box');
                console.log(r);
                $('#result_box').each(function(){
                    console.log("오늘의 방문자 수 : " + $(this).text());
                })
                var file = 'test1.txt';
                fs.writeFile(file, data, "utf8", function (error) {
                    console.log('write end')
                });
            });
        }, 3000);
    });

    res.render('translate', {var1:Date(), var2:inputtext});
});
app.listen(3000, function(){
    console.log('Connected 3000 port!');
});