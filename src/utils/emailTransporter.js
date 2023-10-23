const nodemailer = require("nodemailer");
const { EMAIL, PSW_EMAIL } = require("../config/config.js");

const transporter = nodemailer.createTransport({  //definimos el transporter para poder enviar el mail
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: `${EMAIL}`,
      pass: `${PSW_EMAIL}`
    }
  });

module.exports = { transporter }