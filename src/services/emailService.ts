import {ses} from './awsConfiguration';

const sendEmail = async (senderEmail: string, recipientEmail: string, subject: string,
    body: string) => {
        const params = {
            Source: senderEmail,
            Destination: {
                ToAddresses: [recipientEmail],
            },
            Message: {
                Subject: {
                    Data: subject
                },
                Body: {
                    Text: {
                        Data: body
                    },
                },
            },
        }
        
        try {
            const result = await ses.sendEmail(params).promise();
            console.log(`Email sent successfuly!`);
            console.log(result);
        } catch (error) {
            console.log(`Error sending this email: ${error}`);
        }
    }

export const emailServices = {
    sendEmail
}