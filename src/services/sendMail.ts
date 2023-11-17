import nodemailer, { Transporter, SendMailOptions } from 'nodemailer'

export const transporter: Transporter = nodemailer.createTransport({
    service: 'SendGrid',
    auth: {
        user: 'apikey',
        pass: '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'
    }

})

export const mailOptions:SendMailOptions = {
    from: 'noreply@thealchemist.de',
    to: 'thunderstruck772@gmail.com',
    subject: 'test email',
    text: 'Hello, this is a test email sent using Nodemailer!'
}


