import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_SMTP_HOST,
  port: process.env.MAIL_SMTP_PORT,
  auth: {
    user: process.env.MAIL_SMTP_USER,
    pass: process.env.MAIL_SMTP_PASS,
  },
  secure: process.env.NODE_ENV === "production" ? true : false,
});

async function send(mailOptions) {
  await transporter.sendMail(mailOptions);
}

const email = {
  send,
};

export default email;
