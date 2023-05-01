const User = require("../models/user");
const Role = require("../models/role");
const crypto = require('crypto');

const userPost = async (req, res) => {
  var user = new User();

  const role = await Role.findById(req.body.role_id) // Get role by ID

  // Set user data
  user.email = req.body.email;
  user.first_name = req.body.first_name;
  user.last_name = req.body.last_name;
  user.password = crypto.createHash('md5').update(req.body.password).digest("hex");
  user.country = req.body.country;
  user.address = req.body.address;
  user.city = req.body.city;
  user.zip_code = req.body.zip_code;
  user.number = req.body.number;

  user.role = role;



  if (user.email
    && user.first_name
    && user.last_name
    && user.password
    && user.country
    && user.address
    && user.city
    && user.zip_code
    && user.number
    && user.role


  ) {// If all required data is provided
    user.save(function (err) {
      if (err) {
        res.status(422);//unprocessable entity
        console.log('Error while saving the user', err)
        res.json({
          error: 'There was an error saving the user'
        });
      }
      res.status(201);//CREATED
      console.log('User create OK');
      res.header({
        'location': `http://localhost:4000/user/?id=${user.id}`
      });
      res.json(user);
    });
  } else {
    res.status(422);//unprocessable entity
    console.log('No valid data provided for user')
    res.json({
      error: 'No valid data provided for user'
    });
  }
};
const userGet = (req, res) => {
  // if a specific User is required
  if (req.query && req.query.email && req.query.password) {
    const email = req.query.email;
    const password = crypto.createHash('md5').update(req.query.password).digest("hex");

    User.findOne({ email: email, password: password }, async function (err, user) {
      if (err) {
        res.status(500);
        console.log('Error while querying the user', err);
        res.json({ error: "Internal server error" });
      } else if (!user) {
        res.status(404);
        console.log('User not found');
        res.json({ error: "User not found" });
      } else {
        // compare the password with the hashed password stored in the database

        res.json(user);
        const response = await sendSMS(user.number);//send sms

        if (response && response.code) {
          user.phoneCode = response.code;
          user.save((err) => {
            if (err) {
              return res.status(500).send({ msg: err });
            }
            return res.json({ msg: 'Codigo enviado' });
          });
        } else {
          return res.status(500).json({ msg: 'Error al enviar el codigo, intente mas tarde' });
        }



      }
    });
  }
};
const userDelete = async (req, res) => {
  try {
    const userId = req.params.id; // assuming that you're passing the user ID in the request params

    // find the user by ID and delete it
    const result = await User.findByIdAndDelete(userId);

    if (!result) {
      return res.status(404).json({ msg: 'User not found' });
    }

    return res.json({ msg: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal server error' });//Internal server error
  }
};


const getAllUsers = (req, res) => {
  User.find({}, function (err, users) {
    if (err) {
      res.status(500);//Internal server error
      console.log('Error while querying the users', err);
      res.json({ error: "Internal server error" });
    } else {
      res.json(users);
    }
  });
};


const activateUser = async (req, res) => {
  try {
    const userId = req.params.id; // assuming that you're passing the user ID in the request params

    // find the user by ID and update the status
    const result = User.findByIdAndUpdate(userId, { status: "Active" }, function(err, user) {
      if (err) {
        console.log("Error while updating user status", err);
        // handle error response
      } else if (!user) {
        console.log("User not found");
        // handle not found response
      } else {
        console.log("User status updated successfully");
        // handle success response
      }
    });

    if (result.nModified === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }

    return res.json({ msg: 'User status updated successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};
module.exports = {
  userPost,
  userGet,
  userDelete,
  getAllUsers,activateUser

  //userSession
}

