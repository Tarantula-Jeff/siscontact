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
      from: `"Cyril Photos" <${process.env.EMAIL_USER}>`,
      to: process.env.RECEIVER_EMAIL, // Receiver's email
      subject: "New Contact Form Submission",
      text: `
                BOOKING MESSAGE
      -------------------------------------
      
        Name: ${firstName} ${lastName}
        Email: ${email}
        Phone: ${phone || "Not provided"}
        Message: ${message}
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Redirect to success page on successful email
    return res.redirect(303, "https://github.com/Tarantula-Jeff/Cyril-Photos/blob/main/improved%20fold/success.html"); // 303 ensures the browser performs a GET request to the success page
  } catch (error) {
    console.error("Email Error:", error);
    return res.status(500).send({ message: "Email could not be sent", error });
  }
}
