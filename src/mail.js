const nodemailer = require('nodemailer');

//let transport = nodemailer.createTransport(options[ defaults])

var transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "1794c5e6d72cd7",
      pass: "273120da393351"
    }
  });
  const message = {
    from: 'test@boardies.com', // Sender address
    to: 'to@email.com',         // List of recipients
    subject: 'child board game ', // Subject line
    html: '<h1>Boardies</h1><br><h3>Have the most fun you can . Get your board game today!</h3>' // Plain text body
   
};
transport.sendMail(message, function(err, info) {
    if (err) {
      console.log(err)
    } else {
      console.log(info);
    }
});

module.exports = transport;

