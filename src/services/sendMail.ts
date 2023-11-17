import nodemailer, { Transporter, SendMailOptions } from 'nodemailer'

export const transporter: Transporter = nodemailer.createTransport({
    host: 'smtp.elasticemail.com',
    port: 2525,
    auth: {
        user: 'alii403304@gmail.com',
        pass: '32C59FA4E88856D9ED8592AF13612116429F'
    }

})

export const mailOptions:SendMailOptions = {
    from: 'alii403304@gmail.com',
    to: 'thunderstruck772@gmail.com',
    subject: 'test email',
    text: 'Hello, this is a test email sent using Nodemailer!'
}


