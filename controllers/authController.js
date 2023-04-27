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
            const url = "http://localhost:4000/auth/confirm/";


            const response = await sendEmail(user.first_name, user.email, confirmCode, url);
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
                return res.send(`
                  <html>
                    <head>
                      <title>Cuenta confirmada</title>
                      <style>
                      body {
                        font-family: Arial, Helvetica, sans-serif;
                        background-color: #f2f2f2;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                      }
                      h1 {
                        font-size: 36px;
                        color: green;
                        text-align: center;
                      }
                      </style>
                    </head>
                    <body>
                      <h1>Cuenta confirmada, ya puede iniciar sesión</h1>
                    </body>
                  </html>
                `);
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

            user.phoneCode = '';
            await user.save();

            const token = jwt.sign({ ...user.toObject() }, secretKey, { expiresIn: "2h" });
            return res.json({ msg: 'Logueado', token });
        });
}
// guarda token temporal en el usuario y enviar correo
const loginPasswordLess = async (req, res) => {
    if (req.body && req.body.email) {
        const email = req.body.email;

        try {
            const user = await User.findOne({ email: email }).exec();

            if (!user) {
                res.status(404);
                return res.json({ error: "User not found" });
            }

            if (user.status !== "Active") {
                res.status(401);
                return res.json({ error: "Account not verified" });
            }

            const token = jwt.sign({ email: user.email }, secretKey, {
                expiresIn: "2h",
            });
            const url = "http://localhost:4000/auth/passwordLess/";//este url debe de cambiar, por cual?

            user.tokenTemp = token;
            await user.save();

            const response = await sendEmail(user.first_name, user.email, token, url);

            if (!response) {
                res.status(500);
                return res.json({
                    error:
                        "There was an error sending the email, please contact the administrator",
                });
            }

            res.status(200);
            return res.json({
                message:
                    "Passwordless login link sent, please check your email to access your account",
            });
        } catch (err) {
            res.status(500);
            console.error("Error while querying the user", err);
            return res.json({ error: "Internal server error" });
        }
    } else {
        res.status(400);
        return res.json({ error: "Bad request, email is missing" });
    }
};


// Verifica el token enviado al email y crea el token de logueo
const verifyPasswordLess = async (req, res) => {
    User.findOne({ tokenTemp: req.params.token }).then((user) => {
        if (!user) {
            return res.status(404).send({ message: "Usuario no encontrado" });
        }

       
        user.tokenTemp = '';
        const token = jwt.sign({ ...user.toObject() }, secretKey, { expiresIn: "2h" });


        user.save((err) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            return res.send(`
                <html>
                    <head>
                    <title>Inicio de Sesion completado</title>
                    <style>
                    body {
                        font-family: Arial, Helvetica, sans-serif;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                      }
                      
                      p {
                        font-size: 24px;
                        color: green;
                        margin-bottom: 20px; /* add some space between text and button */
                      }
                      
                      button {
                        background-color: #4CAF50;
                        border: none;
                        color: white;
                        padding: 16px 32px;
                        text-align: center;
                        text-decoration: none;
                        display: inline-block;
                        font-size: 16px;
                        cursor: pointer;
                      }
                    </style>
                    </head>
                    <body>
                    <p>Cuenta confirmada, ya puede iniciar sesión</p>
                    <button id="continue-btn">Continuar en la cuenta</button>
                    <script>
                       
                        document.querySelector('#continue-btn').addEventListener('click', () => {
                       
                        window.location.href = 'http://localhost:3000/?token=${token}';
                        });
                    </script>
                    </body>
                </html>
                `);
        });
    })
        .catch((e) => console.log("error", e));
}



module.exports = {
    registerPost,
    confirmAccountGet,
    // loginPost,
    login2FAPost,
    verifyPhoneCode, loginPasswordLess
    , verifyPasswordLess
}