const nodemailer = require("nodemailer");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send({ message: "Only POST requests are allowed" });
  }

  const { firstName, lastName, email, phone, message } = req.body;

  try {
    // Configure the transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail", // Or another email provider
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email password or app password
      },
    });

    // Configure the email
    const mailOptions = {
      from: email,
      to: process.env.RECEIVER_EMAIL, // Receiver's email
      subject: "New Contact Form Submission",
      text: `
        Name: ${firstName} ${lastName}
        Email: ${email}
        Phone: ${phone || "Not provided"}
        Message: ${message}
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return res.status(200).send({ message: "Email sent successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Email could not be sent", error });
  }
}
