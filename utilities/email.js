const nodemailer = require('nodemailer');
const sendEmail = async(options)=>{
  console.log(options.email,options.message,options.subject,options.url)

const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "ce1d3e01f582c5",
      pass: "1951c204ad4f2b"
    }
});
    const mailOptions = {
        from: 'kirinyagasda@gmail.com',
        to: options.email,
        subject: options.subject,
        text: options.message,
        html:
        `<a href=${options.url}>${options.message}</a>`
      };
      await transport.sendMail(mailOptions)
}
module.exports = sendEmail;
