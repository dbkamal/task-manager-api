const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'dbkamal@gmail.com',
        subject: 'Welcome to the Task Manager App',
        text: `Thanks for joining, ${name}`
    })
}

// const msg = {
//     to: 'dbkamal@gmail.com',
//     from: 'dbkamal@gmail.com',
//     subject: 'test mail sgmail',
//     text: 'test..',
//     html: '<strong>study node js</strong>'
// };

// sgMail.send(msg)

module.exports = {
    sendWelcomeEmail
}