const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Session = require("../models/session");
const secretKey = 'cacahuate';

const sessionPost = async (req, res) => {
  var session = new Session();
  const expirationTime = new Date();

  // insert token to the session table
  const token = jwt.sign(req.body, secretKey);

  session.token = token;
  session.user = req.body.email;
  session.expire = expirationTime.setHours(expirationTime.getHours() + 1);

  if (session.token
    && session.user
    && session.expire

  ) {  // Check if all required session details are present

    session.save(function (err) {
      if (err) {
        res.status(422); //unprocessable entity
        console.log('Error while saving the notice', err)
        res.json({
          error: 'There was an error saving the notice'
        });
      }
      res.status(201);//CREATED

      console.log('Session create OK');


      res.json(session);
    });
  } else {
    res.status(422); //unprocessable entity
    console.log('Error while saving the session')
    res.json({
      error: 'No valid data provided for session'
    });
  }
}

const sessionGet = async (req, res) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');


    if (!token) {
      return res.status(401).send('Unauthorized');
    }

    const decoded = jwt.verify(token, secretKey);
    res.json(decoded);

  } catch (error) {
    res.status(401).send('Unauthorized');
    console.log('Invalid or expired token');
  }
};


module.exports = {
  sessionPost,
  sessionGet
}