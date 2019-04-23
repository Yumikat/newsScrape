var express = require("express");
var mongoose = require("mongoose");
var PORT = process.env.PORT || 3000;
var axios = require("axios");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars");
var db = require("./models");

var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// var databaseUrl = "newsScrape";
// var collections = ["scrapedNews"];

// var db = mongojs(databaseUrl, collections);
// db.on("error", function(error) {
//     console.log("Database error:", error);
// });

mongoose.connect("mongodb://localhost/newsScrape", { useNewUrlParser: true });


// app.get("/", function(req, res) {
//     res.send("Hello yumikat");
// });

app.get("/all", function (req, res) {
    db.Article.find({}, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            res.json(data);
        }
    });
});

app.get("/nyt", function (req, res) {
    axios.get("https://www.nytimes.com/").then(function (response) {
        var $ = cheerio.load(response.data);

        // var results = [];

        $("article").each(function (i, element) {
            var title = $(element).children().text();
            var link = $(element).find("a").attr("href");
            var summary = $(element).find("ul.e1n8kpyg1").text();

            if (title && link && summary) {

                db.Article.insert({ title, link, summary }, function (err, inserted) {
                    if (err) {
                        console.log(err);
                    } else {
                        // results.push(title);
                        console.log(inserted);
                    }
                });
            }
        });
    });
    res.send("Scrape complete");
});

app.get("/onion", function (req, res) {
    axios.get("https://www.theonion.com/").then(function (response) {
        var $ = cheerio.load(response.data);

        // var results = [];

        $("article.postlist_item").each(function (i, element) {
            var title = $(element).find("h1.headline").text();
            var link = $(element).children().attr("href");
            var summary = $(element).children().find("div.entry-summary").find("p").text();

            if (title && link && summary) {

                db.Article.insert({ title, link, summary }, function (err, inserted) {
                    if (err) {
                        console.log(err);
                    } else {
                        // results.push(title);
                        console.log(inserted);
                    }
                });
            }
        });
    });
    res.send("Scrape complete");
});

app.listen(PORT, function () {
    console.log("Running on localhost:" + PORT + ".");
});
