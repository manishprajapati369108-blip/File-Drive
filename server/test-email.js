// test-email.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  debug: true, // Show detailed logs
});

const testEmail = async () => {
  console.log('📧 Testing Brevo SMTP...');
  console.log('📧 Host:', process.env.SMTP_HOST);
  console.log('📧 Port:', process.env.SMTP_PORT);
  console.log('📧 User:', process.env.SMTP_USER);
  console.log('📧 From:', process.env.EMAIL_FROM);
  console.log('📧 To: manishprajapati369108@gmail.com');

  try {
    const info = await transporter.sendMail({
      from: `"Test" <${process.env.EMAIL_FROM}>`,
      to: 'manishprajapati369108@gmail.com',
      subject: '✅ Brevo SMTP Test',
      html: '<h2>✅ Email Service is Working!</h2><p>Your Brevo SMTP is configured correctly.</p>',
    });
    console.log('✅ Test email sent!');
    console.log('📧 Message ID:', info.messageId);
  } catch (error) {
    console.error('❌ Test failed:');
    console.error('📧 Error message:', error.message);
    console.error('📧 Error code:', error.code);
    console.error('📧 Full error:', error);
  }
};

testEmail();