"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailOptions = exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.transporter = nodemailer_1.default.createTransport({
    service: 'SendGrid',
    auth: {
        user: 'apikey',
        pass: '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'
    }
});
exports.mailOptions = {
    from: 'noreply@thealchemist.de',
    to: 'thunderstruck772@gmail.com',
    subject: 'test email',
    text: 'Hello, this is a test email sent using Nodemailer!'
};
