import {ses} from './awsConfiguration';
import { serviceStatuses } from './enums';

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
            return {
                status: serviceStatuses.SUCCESS,
                message: 'Email sent successfuly!'
            }
        } catch (error) {
            return {
                status: serviceStatuses.ERROR,
                message: `Error sending email: ${error}`
            }
        }
    }

export const emailServices = {
    sendEmail
}