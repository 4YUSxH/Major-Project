import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
  try {
    // Generate an Ethereal test account automatically if we don't have real credentials configured
    let transporterConfig;

    if (process.env.SMTP_HOST) {
      transporterConfig = {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      };
    } else {
      const testAccount = await nodemailer.createTestAccount();
      transporterConfig = {
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user, // generated ethereal user
          pass: testAccount.pass, // generated ethereal password
        },
      };
    }

    const transporter = nodemailer.createTransport(transporterConfig);

    const message = {
      from: `${process.env.FROM_NAME || 'Help Desk System'} <${process.env.FROM_EMAIL || 'noreply@helpdesk.local'}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    const info = await transporter.sendMail(message);
    
    // If using Ethereal, log the preview URL
    if (!process.env.SMTP_HOST) {
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }

  } catch (error) {
    console.error("Email could not be sent:", error);
  }
};
