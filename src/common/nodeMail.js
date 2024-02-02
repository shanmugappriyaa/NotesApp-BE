const nodeMailer = require("nodemailer");

const transporter = nodeMailer.createTransport({
  service: "Gmail",
  auth: {
    user: "pspri03@gmail.com",
    pass: "ixdbtbkyzkumiqlh",
  },
});

const mailOptions = {
  from: "pspri03@gmail.com",
  to: "",
  subject: "Notes Reminder",
  text: "",
  html: "",
};

module.exports = { transporter, mailOptions };
