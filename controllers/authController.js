const jwt = require('jsonwebtoken');
const User = require("../models/user");
const Role = require("../models/role");
const { sendEmail } = require("../utils/sendEmail");
//const { encryptPassword } = require("../utils/encryptPassword");
const { sendSMS } = require('../utils/sendSMS');
const crypto = require('crypto');
const secretKey = 'cacahuate';


// Registra el usuario y envia el correo para activar la cuenta
const registerPost = async (req, res) => {

    const rol = await Role.findById(req.body.role_id)
  

    //Cuando se registra el usario, se genera el codigo de confirmación
    const confirmCode = jwt.sign(req.body.email, secretKey);
    const password = crypto.createHash('md5').update(req.body.password).digest("hex");
    var user = new User();

    user.email = req.body.email;
    user.password = password;
    user.first_name = req.body.first_name;
    user.last_name = req.body.last_name;
    user.address = req.body.address;
    user.zip_code = req.body.zip_code;
    user.country = req.body.country;
    user.city = req.body.city;
    user.number = req.body.number;
    user.confirmCode = confirmCode;
    user.role = rol;


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
        && user.status
        && user.confirmCode
    ) {
        user.save(async (err) => {
            if (err) {
                res.status(422);
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


            const response = await sendEmail(user.first_name, user.email, confirmCode);
            if (!response) {
                return res.status(500).json({ msg: "Error al enviar el correo, por favor, ponerse en contacto con el administrador" });
            }
            return res.json({ msg: "Usuario registrado, por favor, revise su correo, para activar la cuenta" });
        });
    }

};

// Confirma la cuenta con el correo enviado
const confirmAccountGet = async (req, res) => {
    User.findOne({ confirmCode: req.params.confirmationCode })
        .then((user) => {
            if (!user) {
                return res.status(404).send({ message: "Usuario no encontrado" });
            }

            user.status = "Active";
            user.save((err) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                return res.send('Cuenta confirmada, ya puede iniciar sesión');
            });
        })
        .catch((e) => console.log("error", e));
}




// Login con autenticacion de dos pasos (Envia el codigo al celular)
const login2FAPost = async (req, res) => {

    if (req.body && req.body.email && req.body.password) {
        const email = req.body.email;
        const password = crypto.createHash('md5').update(req.body.password).digest("hex");
        User.findOne({ email: email, password: password })
            .exec(async function (err, user) {

                if (err) {
                    res.status(500);
                    console.log('Error while querying the user', err);
                    res.json({ error: "Internal server error" });
                } else if (!user) {
                    res.status(404);
                    console.log('User not found');
                    res.json({ error: "User not found" });
                } else {

                    if (user.status !== 'Active') {
                        return res.status(401).json({ msg: 'Cuenta no verificada' });
                    }

                    const response = await sendSMS(user.number);

                    if (response && response.code) {
                        console.log('message sent');
                        user.phoneCode = response.code;
                        console.log('user.phoneCode');
                        console.log(user.phoneCode);
                        user.save((err) => {
                            if (err) {
                                return res.status(500).send({ msg: err });
                            }
                            console.log('Codigo enviado');
                            return res.json({ msg: 'Codigo enviado' });
                        });
                    } else {
                        return res.status(500).json({ msg: 'Error al enviar el codigo, intente mas tarde' });
                    }
                }

            });
    }
}

// Verifica el codigo enviado al celular y crea el token de logueo
const verifyPhoneCode = async (req, res) => {
    User.findOne({ email: req.body.email, phoneCode: req.body.phoneCode })
        .exec(async function (err, user) {

            if (err) {
                return res.status(500).json(err);
            }

            if (!user) {
                return res.status(401).json({ msg: 'Codigo incorrecto' });
            }
           

            const token = jwt.sign({ ...user.toObject() }, secretKey, { expiresIn: "2h" });
            return res.json({ msg: 'Logueado', token });
        });
}
// Verifica el codigo enviado al correo y crea el token de logueo
const passwordLess = async (req, res) => {
    const confirmCode = jwt.sign(req.body.email, secretKey);
    if (req.body && req.body.email) {
      const email = req.body.email;
      User.findOne({ email: email }).exec(async function (err, user) {
        if (err) {
          res.status(500);
          console.log('Error while querying the user', err);
          res.json({ error: "Internal server error" });
        } else if (!user) {
          res.status(404);
          console.log('User not found');
          res.json({ error: "User not found" });
        } else {
          if (user.status !== 'Active') {
            return res.status(401).json({ msg: 'Cuenta no verificada' });
          }
          const response = await sendEmail(user.first_name, user.email, confirmCode);
          if (!response) {
            return res.status(500).json({ msg: "Error al enviar el correo, por favor, ponerse en contacto con el administrador" });
          }
          const token = jwt.sign( user.email, secretKey, { expiresIn: "2h" });
          return res.json( token );
        }
      });
    }
  }
  

module.exports = {
    registerPost,
    confirmAccountGet,
    // loginPost,
    login2FAPost,
    verifyPhoneCode, passwordLess
}