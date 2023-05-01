const Category = require("../models/category");

const categoryPost = async (req, res) => {
    var category = new Category();

    category.name = req.body.name;

    if (category.name
    ) {
        category.save(function (err) {
            if (err) {
                res.status(400);// bad requests
                console.log('Error while saving the category', err)
                res.json({
                    error: 'There was an error saving the category'
                });
            }
            res.status(201);//CREATED
            res.header({
                'location': `http://localhost:4000/category/?id=${category.id}`
            });
            res.json(category);
        });
    } else {
        res.status(422);//Unprocessable Entity
        console.log('Error while saving the category')
        res.json({
            error: 'No valid data provided for category'
        });
    }
};

const categoryGet = (req, res) => {
    // if an specific category is required
    if (req.query && req.query.id) {
        Category.findById(req.query.id, function (err, category) {
            if (err) {
                res.status(404);//Not Found
                console.log('Error while queryting the category', err)
                res.json({ error: "Category doesnt exist" })
            }
            res.json(category);
        });
    } else {
        // get all categories
        Category.find(function (err, categories) {
            if (err) {
                res.status(404);//Not Found
                res.json({ "error": err });
            }
            res.json(categories);
        });

    }
};

const categoryPatch = (req, res) => {
    // Get category by id

    if (req.query && req.query.id) {
        Category.findById(req.query.id, function (err, category) {
            if (err) {
                res.status(404);//Not Found
                console.log('Error while queryting the category', err)
                res.json({ error: "Category doesnt exist" })
            }
            category.name = req.body.name ? req.body.name : category.name;
            category.save(function (err) {
                if (err) {
                    res.status(400);//bad requests
                    console.log('Error while saving the category', err)
                    res.json({
                        error: 'There was an error saving the category'
                    });
                }
                res.status(200); // OK
                res.json(category);
            });
        });
    } else {
        res.status(404);
        res.json({ error: "Category doesnt exist" })
    }
};

const categoryDelete = (req, res) => {
    // if an specific category is required
    if (req.query && req.query.id) {
        Category.findById(req.query.id, function (err, category) {
            if (err) {
                res.status(404);//Not Found
                console.log('Error while queryting the category', err)
                res.json({ error: "Category doesnt exist" })
            }
            //If the category exists
            if (category) {
                category.remove(function (err) {
                    if (err) {
                        res.status(500).json({ message: "There was an error deleting the category" });// server errors
                    }
                    res.status(204).json({});//No Content
                })
            } else {
                res.status(404);//Not Found
                console.log('Error while queryting the category', err)
                res.json({ error: "Category doesnt exist" })
            }
        });
    } else {
        res.status(404).json({ error: "You must provide a category ID" });
    }
};



module.exports = {
    categoryPost,
    categoryGet,
    categoryPatch,
    categoryDelete,
}