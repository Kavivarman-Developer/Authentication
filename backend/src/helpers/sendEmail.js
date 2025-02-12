import nodeMailer from 'nodemailer';
import path from 'path';
import dotenv from 'dotenv';
import hbs from 'nodemailer-express-handlebars';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const sendEmail = async (send_to, send_from, name, subject, template, reply_to, link) => {
    try {
        console.log(`📧 Sending email to: ${send_to} using template: ${template}`);

        // Ensure the template is a valid string and not an email address
        if (!template || typeof template !== 'string' || template.includes('@')) {
            throw new Error(`Invalid template name: "${template}". Expected a valid Handlebars template filename.`);
        }

        // Create a transporter
        const transporter = nodeMailer.createTransport({
            service: "gmail",
            host: 'smtp.gmail.com', // Corrected typo
            port: 587,
            secure: false,
            auth: {
                user: process.env.USER_EMAIL, // Your Gmail email
                pass: process.env.EMAIL_PASS,  // Your App Password from Google
            },
        });

        // Verify transporter connection
        await transporter.verify();
        console.log("✅ Transporter is ready to send emails.");

        // Handlebars template configuration
        const handlebarsOptions = {
            viewEngine: {
                extName: ".handlebars",
                partialsDir: path.resolve(__dirname, '../views/partials'),
                layoutsDir: path.resolve(__dirname, "../views/layouts"),
                defaultLayout: false,
            },
            viewPath: path.resolve(__dirname, '../views'),
            extName: ".handlebars",
        };

        transporter.use("compile", hbs(handlebarsOptions));

        // Mail options
        const mailOptions = {
            from: send_from,
            to: send_to,
            replyTo: reply_to,
            subject: subject,
            template: template, // Ensure this matches the filename (e.g., "emailVerification")
            context: {
                name: name || 'User',
                link: link,
            },
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully! Message ID: ${info.messageId}`);

        return info;
    } catch (error) {
        console.error("❌ Error sending email:", error.message);
        throw error;
    }
};

export default sendEmail;
