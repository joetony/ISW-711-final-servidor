const Source = require("../models/source");
const News = require("../models/news");
const Category = require("../models/category");
const User = require("../models/user");

const { parseStringPromise } = require('xml2js');

const newsPost = async (req, res) => {
    var news = new News();

    const source = await Source.findById(req.body.source_id);
    const user = await User.findById(req.body.user_id);
    const category = await Category.findById(req.body.category_id);

    news.title = req.body.title;
    news.description = req.body.description;
    news.permanlink = req.body.permanlink;

    news.source = source;
    news.date = req.body.date;

    if (news.title
        && news.description
        && news.permanlink
        && source
    ) {
        news.save(function (err) {
            if (err) {
                res.status(422);
                console.log('Error while saving the notice', err)
                res.json({
                    error: 'There was an error saving the notice'
                });
            }
            res.status(201);//CREATED
            console.log('Notice create OK');
            res.header({
                'location': `http://localhost:4000/news/?id=${news.id}`
            });
            res.json(news);
        });
    } else {
        res.status(422);
        console.log('Error while saving the notice')
        res.json({
            error: 'No valid data provided for notice'
        });
    }
};

const newsGet = async (req, res) => {
    // if a specific User is required
    const xmlData = res.data;
    const jsonData = await parseStringPromise(xmlData);
    if (jsonData) {
        
        News.find({ user_id: req.query.user_id, category_id: req.query.category_id }, function (err, news) {
            if (err) {
                res.status(500);
                console.log('Error while querying the user', err);
                res.json({ error: "Internal server error" });
            } else if (!news) {
                res.status(404);
                console.log('User not found');
                res.json({ error: "User not found" });
            } else {
                // compare the password with the hashed password stored in the database
                res.status(200);
                res.json(news);


            }
        });
    }
};/*
const newsGet = (req, res) => {
    // if an specific notice is required
    if (req.query && req.query.id) {
        News.findById(req.query.id, function (err, notice) {
            if (err) {
                res.status(404);
                console.log('Error while queryting the notice', err)
                res.json({ error: "Notice doesnt exist" })
            }
            res.json(notice);
        });
    } else {
        // get all soruces
        News.find(function (err, news) {
            if (err) {
                res.status(422);
                res.json({ "error": err });
            }
            res.json(news);
        });

    }
};*/

const newsPatch = async (req, res) => {
    // get notice by id
    //const category = await Category.findById(req.body.category);
    //const source = await Source.findById(req.body.source);

    var notice = new News();

    //notice.category = category;
    //notice.source = source;

    if (req.query && req.query.id) {
        News.findById(req.query.id, function (err, news) {
            if (err) {
                res.status(404);
                console.log('Error while queryting the notice', err)
                res.json({ error: "Notice doesnt exist" })
            }

            // update the notice object (patch)
            news.title = req.body.title ? req.body.title : news.title;
            news.description = req.body.description ? req.body.description : news.description;
            news.permanlink = req.body.permanlink ? req.body.permanlink : news.permanlink;
            //notice.category = category;
            //notice.source = source;

            news.save(function (err) {
                if (err) {
                    res.status(422);
                    console.log('Error while saving the notice', err)
                    res.json({
                        error: 'There was an error saving the notice'
                    });
                }
                res.status(200); // OK
                res.json(news);
            });
        });
    } else {
        res.status(404);
        res.json({ error: "Notice doesnt exist" })
    }
};

const newsDelete = (req, res) => {
    // if an specific notice is required
    if (req.query && req.query.id) {
        News.findById(req.query.id, function (err, news) {
            if (err) {
                res.status(500);
                console.log('Error while queryting the notice', err)
                res.json({ error: "Notice doesnt exist" })
            }
            //if the notice exists
            if (news) {
                news.remove(function (err) {
                    if (err) {
                        res.status(500).json({ message: "There was an error deleting the notice" });
                    }
                    res.status(204).json({});
                })
            } else {
                res.status(404);
                console.log('Error while queryting the notice', err)
                res.json({ error: "Notice doesnt exist" })
            }
        });
    } else {
        res.status(404).json({ error: "You must provide a notice ID" });
    }
};




module.exports = {
    newsPost,
    newsGet,
    newsPatch,
    newsDelete,
};