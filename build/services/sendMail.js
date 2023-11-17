"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailOptions = exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.transporter = nodemailer_1.default.createTransport({
    host: 'smtp.elasticemail.com',
    port: 2525,
    auth: {
        user: 'alii403304@gmail.com',
        pass: '32C59FA4E88856D9ED8592AF13612116429F'
    }
});
exports.mailOptions = {
    from: 'alii403304@gmail.com',
    to: 'thunderstruck772@gmail.com',
    subject: 'test email',
    text: 'Hello, this is a test email sent using Nodemailer!'
};
