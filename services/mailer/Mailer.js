import { createTransport } from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// set up the email transporter
const setupTransporter = () => {
    return createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: "shutterbugstudios101@gmail.com",
            pass: process.env.PASS,
        },
    });
};

// send an email
const sendEmail = async (options) => {
    try {
        const transporter = setupTransporter();

        // Send the email
        await transporter.sendMail(options);

        console.log("Email sent successfully.");
    } catch (error) {
        console.log("Error sending email:", error);
        throw error; // Re-throw the error to be handled by the calling function if needed
    }
};

// send the notification email
const sendNotificationEmail = async (userEmail) => {
    const options = {
        from: process.env.USER,
        to: "nyawayanathan@gmail.com, bellahbelle36@gmail.com",
        subject: "New User About To confirm ShutterbugStudios",
        text: `User with email ${userEmail} are in the registering process.`,
    }; 

    await sendEmail(options);
};

// successfull confirmed
const successfullRegistered = async (userEmail) => {
    const options = {
        from: process.env.USER,
        to: "nyawayanathan@gmail.com, bellahbelle36@gmail.com",
        subject: "New User Successfully Registered",
        text: `User with email ${userEmail} SUCCESSFULLY registered. #GROWING`,
    };

    await sendEmail(options);
};

// send the verification email
const verifyEmail = async (email, code) => {
    const options = {
        from: process.env.USER,
        to: email,
        subject: "ShutterbugStudios Account Verification",
        html: `
    <body style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333;">
      <h1 style="font-size: 24px; font-weight: bold; margin: 0 0 20px; background-color: green; padding: 10px; color: white; text-align: center;">Thank you for joining ShutterbugStudios</h1>
      <p>
        Your confirmation code is: <span style="color: #007bff; font-weight: bold;">${code}</span>
      </p>
      <p>
        We appreciate your interest in our platform. Please use the above confirmation code to complete your account verification process.
      </p>
      <p>
        If you encounter any issues during the sign-up process, reach out to us using the same email address.
      </p>
      <p>
        Thank you again for choosing ShutterbugStudios. Exciting Photos Waiting... Enjoy!
      </p>
      <p>
        Yours,<br>
        NateB 
      </p>
      </body>
    `,
    };

    await sendEmail(options);

    // Send notification email after the user's email is successfully sent
    await sendNotificationEmail(email);
};

export { verifyEmail, successfullRegistered };
