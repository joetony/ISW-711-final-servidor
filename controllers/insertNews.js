//saves the news on the database
const Source = require("../models/source");
let Parser = require('rss-parser');
let parser = new Parser();
const News = require("../models/news");
const User = require("../models/user");
const Category = require("../models/category");
const fetchAndSaveNews = async (req, res) => {
  try {
      const id = req.params.id;
     
      const newSourceResult = await Source.findById(id );
    
      await News.deleteMany({ 'source.id': id})
      //search a newsource id that matches whit the id provided
      
      if (!newSourceResult) {
          return res.status(404).send('New Source Not found');
      }

      // obtain the new source url
      const url = newSourceResult.url;
      const newsList = [];

     
      const userFound = await User.findById(newSourceResult.user._id);
      const categoryFound  = await Category.findById(newSourceResult.category._id);

      let feed = await parser.parseURL(url);
     
        
      feed.items.forEach(async item => {
          const New = new News({
              title: item.title,
              description: item.contentSnippet,
              permanlink: item.link,
              date: item.pubDate,
              source: newSourceResult,
              user: userFound,
              category: categoryFound,
              imagen:item.enclosure
          });
          const saveNew = await New.save();
          newsList.push(saveNew);
          console.log(saveNew);
      });

      res.status(201).json(newsList);

  } catch (err) {
      console.log('Error al realizar la consulta:', err);
      res.status(500).send('Error al realizar la consulta');
  }


};

module.exports = {
  fetchAndSaveNews
};