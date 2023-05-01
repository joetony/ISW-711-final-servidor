const Tag = require('../models/tags');


const tagsGet = async (req, res) => {
    try {
        const result = await Tag.find();// finding all the tags from the database
        return res.json({ data: result });// returning the tags as JSON
    } catch (error) {
        console.log(error)
		return res.status(500).json({ msg: error });// returning a 500 status and an error message
    }
  };

const saveTags = async (tags) => {
    try {
        const tagMapped = tags.map(tag => ({ name: tag }));// creating an array of objects to each tag string

        const tagsDB = await Tag.find(); // finding all the tags in the database

        const tagsToAssign = [];

        const tagsToInsert = tagMapped.filter(tag => {// filtering the tags that need to be inserted into the database
            const index = tagsDB.findIndex(tagDB => tagDB.name === tag.name);
            if (index === -1) {
                return tag;
            }
            tagsToAssign.push(tagsDB[index]);// if the tag exists, add it to the tagsToAssign array
            return null;
        });
        const tagsInserted = await Tag.insertMany(tagsToInsert);// inserting the new tags into the database

        return [...tagsToAssign, ...tagsInserted];// returning an array with all the tags
    } catch (error) {
        return false;
    }
}

module.exports = {
    saveTags,
    tagsGet
}