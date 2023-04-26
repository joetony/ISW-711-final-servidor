const Role = require("../models/role");

const rolePost = async (req, res) => {
   

    const role = await Role.findById(req.body.rol_id);

    role.name = req.body.name;

    if (role.name
    ) {
        role.save(function (err) {
            if (err) {
                res.status(422);
                console.log('Error while saving the Rol', err)
                res.json({
                    error: 'There was an error saving the rol'
                });
            }
            res.status(201);//CREATED
            res.header({
                'location': `http://localhost:4000/role/?id=${role.id}`
            });
            res.json(role);
        });
    } else {
        res.status(422);
        console.log('Error while saving the Rol')
        res.json({
            error: 'No valid data provided for Role'
        });
    }
};

const roleGet = (req, res) => {
    // if an specific Role is required
    if (req.query && req.query.id) {
        Role.findById(req.query.id, function (err, role) {
            if (err) {
                res.status(404);
                console.log('Error while queryting the Role', err)
                res.json({ error: "Role doesnt exist" })
            }
            res.json(role);
        });
    } else {
        // get all Roles
        Role.find(function (err, roles) {
            if (err) {
                res.status(422);
                res.json({ "error": err });
            }
            res.json(roles);
        });

    }
};

const rolePatch = (req, res) => {
    // get Role by id
    if (req.query && req.query.id) {
        Role.findById(req.query.id, function (err, role) {
            if (err) {
                res.status(404);
                console.log('Error while queryting the Role', err)
                res.json({ error: "Role doesnt exist" })
            }
            role.name = req.body.name ? req.body.name : role.name;
            role.save(function (err) {
                if (err) {
                    res.status(422);
                    console.log('Error while saving the role', err)
                    res.json({
                        error: 'There was an error saving the role'
                    });
                }
                res.status(200); // OK
                res.json(role);
            });
        });
    } else {
        res.status(404);
        res.json({ error: "Role doesnt exist" })
    }
};

const roleDelete = async (req, res) => {
    try {
      const roleId = req.params.id; // assuming that you're passing the role ID in the request params
  
      // find the role by ID and delete it
      const result = await Role.findByIdAndDelete(roleId);
  
      if (!result) {
        return res.status(404).json({ msg: 'Role not found' });
      }
  
      return res.json({ msg: 'Role deleted successfully' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };



module.exports = {
    rolePost,
    roleGet,
    rolePatch,
    roleDelete,
}