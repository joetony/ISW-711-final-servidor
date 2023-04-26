const nodemailer = require('nodemailer');

const sendEmail = (name, email, confirmationCode) => {
    return new Promise((resolve, reject) => {
        const mailTransporter = nodemailer.createTransport({

            //

            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: '', // generated ethereal user
                pass: '', // generated ethereal password
            },

        });
        const mailOptions = {
            from: 'hgddtyj@gmail.com',
            to: email,
            subject: 'Confirme su cuenta',
            html:
                `<h1>Correo de confirmación</h1>
                <h2>Hola ${name || ''}</h2>
                <p>Gracias por su suscripción. Por favor, confirme su correo electrónico, ingresando al siguiente enlace: </p>
                <a href=http://localhost:4000/auth/confirm/${confirmationCode}> Entre aquí</a>
                </div>` }

        mailTransporter.verify().then(() => {
            console.log("Ready to send emails");

        })
        mailTransporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error(error);
                reject(error);
            } else {
                console.log('Email sent: ' + info.response);

                resolve(true);
            }
        })
    })
}

module.exports = {
    sendEmail
}
