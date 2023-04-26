const axios = require('axios');
const accountSid = '';
const authToken = '';

//
const client = require('twilio')(accountSid, authToken);


const sendSMS = (phoneNumber) => {//textbelt
  return new Promise((resolve, reject) => {
    const code = Math.floor(100000 + Math.random() * 900000);


    const url = `https://textbelt.com/text`;

    const params = {
      phone: `+506${phoneNumber}`,
      message: `Su codigo es: ${code}`,
      key: 'textbelt'
    };

    axios.post(url, params)
      .then(response => {
        console.log("response.data");
        console.log(response.data);
        resolve({ code });
      })
      .catch(error => {
        console.log("error");
        console.error(error);
        reject(error);
      });
  });
}


const sendSMST = (phoneNumber) => {//Twilio
  return new Promise((resolve, reject) => {
    const code = Math.floor(100000 + Math.random() * 900000);

    client.messages
      .create({
        body: `Su codigo es: ${code}`,
        from: `+15005550006`,
        to: `+506${phoneNumber}`//my numero
        //to: '+50689630917'
      
       
      })
      .then(message => {
        console.log("message.sid");
        console.log(message.sid);//recibo esta respueta
        resolve({ code });
      })
      .catch(error => {
        console.error(error);
        reject(error);
      });
  });
}



module.exports = {
  sendSMS
}