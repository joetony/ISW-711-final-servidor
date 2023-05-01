const Source = require("../models/source");
//const User = require("../models/user");
const Category = require("../models/category");
const User = require("../models/user");
const { updateOne } = require("../models/role");

const sourcePost = async (req, res) => {
    var source = new Source();

    const categoryFound = await Category.findById(req.body.category_id);
    const userFound = await User.findById(req.body.user_id);

    source.url = req.body.url;
    source.name = req.body.name;
    source.category = categoryFound;
    source.user = userFound;

    if (source.url
        && source.name
        && source.category
        && source.user
    ) {
        source.save(function (err) {
            if (err) {
                res.status(422);
                console.log('Error while saving the source', err)
                res.json({
                    error: 'There was an error saving the source'
                });
            }
            res.status(201);//CREATED
            console.log('Source create OK');
            res.header({
                'location': `http://localhost:4000/source/?id=${source.id}`
            });
            res.json(source);
        });
    } else {
        res.status(422);
        console.log('Error while saving the source')
        res.json({
            error: 'No valid data provided for source'
        });
    }
};


const sourceGet = (req, res) => {
    // if an specific source is required
    if (req.query && req.query.id) {
        Source.findById(req.query.id, function (err, source) {
            if (err) {
                res.status(404);
                console.log('Error while queryting the source', err)
                res.json({ error: "Source doesnt exist" })
            }
            res.json(source);
        });
    } else {
        // get all soruces
        Source.find(function (err, sources) {
            if (err) {
                res.status(422);
                res.json({ "error": err });
            }
            res.json(sources);
            res.status(200);
        });

    }
};

const sourcePatch = async (req, res) => {
    try {
        console.log("Updating source...");
        console.log("req.body:", req.body);
        // get source by id
        console.log("si");
        const category = await Category.findById(req.body.category_id);


        if (req.body && req.body._id) {

            Source.findById(req.body._id, function (err, source) {
                if (err) {
                    res.status(404);
                    console.log('Error while queryting the source', err)
                    res.json({ error: "Source doesnt exist" })
                }
                source.url = req.body.url ? req.body.url : source.url;
                source.name = req.body.name ? req.body.name : source.name;
                source.category = category;

                if (source.url
                    && source.name
                    && category
                    //&& user_id
                ) {
                    // update the source object (patch)


                    source.save(function (err) {
                        if (err) {
                            res.status(422);
                            console.log('Error while saving the source', err)
                            res.json({
                                error: 'There was an error saving the source'
                            });
                        }
                        console.log(source);
                        res.status(200); // OK
                        res.json(source);
                    });
                }
            });
        } else {
            res.status(404);
            res.json({ error: "Source doesnt exist" })
        }
    } catch (error) {
        console.log("Error while updating source", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};


const sourceDelete = (req, res) => {

    // if an specific soruce is required
    if (req.query && req.query.id) {
        Source.findById(req.query.id, function (err, soruce) {
            if (err) {
                res.status(500);
                console.log('Error while queryting the soruce', err)
                res.json({ error: "Soruce doesnt exist" })
            }
            //if the soruce exists
            if (soruce) {
                soruce.remove(function (err) {
                    if (err) {
                        res.status(500).json({ message: "There was an error deleting the soruce" });
                    }

                    res.status(204).json({});
                })
            } else {
                res.status(404);
                console.log('Error while queryting the soruce', err)
                res.json({ error: "Soruce doesnt exist" })
            }
        });
    } else {
        res.status(404).json({ error: "You must provide a soruce ID" });
    }
};

const AllSourceGet = async (req, res) => {
    try {
        const sources = await Source.find();
        res.json(sources);
        res.status(200);
    } catch (err) {
        console.log('Error while querying the source', err);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    sourcePost,
    sourceGet,
    sourcePatch,
    sourceDelete, AllSourceGet
}