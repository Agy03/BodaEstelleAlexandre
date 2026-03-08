import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function test() {
  console.log('SMTP_USER:', process.env.SMTP_USER);
  console.log('SMTP_FROM:', process.env.SMTP_FROM);
  console.log('SMTP_PASS:', process.env.SMTP_PASS ? '***set***' : '!!!MISSING!!!');

  try {
    const result = await transporter.sendMail({
      from: `"Estelle & Alexandre" <${process.env.SMTP_FROM}>`,
      to: process.env.SMTP_USER!,
      subject: 'Test - Boda Email',
      text: 'Si recibes este email, el SMTP funciona correctamente.',
    });
    console.log('OK - Email enviado:', result.messageId);
  } catch (error: unknown) {
    const err = error as Error;
    console.error('ERROR:', err.message);
  }
}

test();
