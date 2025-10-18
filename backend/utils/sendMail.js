
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendMail = async (to,otp) => {
  const msg = {
    to,
    from: process.env.EMAIL_FROM,
    subject: "🕵️ Whisperly OTP – Unlock Your Secrets",
    html: `
      <div style="font-family: 'Poppins', sans-serif; background: #f7faff; border-radius: 12px; padding: 20px; border: 1px solid #e0e6ed;">
        <h2 style="text-align:center; color:#10b981;">Whisperly Verification 🔐</h2>
        <p style="font-size:15px; color:#333;">
          Hey there, mysterious soul 👻<br><br>
          Someone (hopefully you 😏) just tried to register into <strong>Whisperly</strong> — the home of secret confessions and untold stories.
        </p>
        <div style="text-align:center; margin:25px 0;">
          <p style="font-size:18px; color:#444;">Here’s your top-secret access code:</p>
          <div style="font-size:30px; letter-spacing:4px; background:#10b981; color:white; display:inline-block; padding:10px 20px; border-radius:10px; font-weight:bold;">
            ${otp}
          </div>
        </div>
        <p style="font-size:14px; color:#555; text-align:center;">
          ⚠️ This code self-destructs in <strong>5 minutes</strong> ⏳<br>
          If you didn’t request this, just ignore it and keep your secrets safe.
        </p>
        <hr style="margin:20px 0; border:none; border-top:1px dashed #ccc;">
        <p style="text-align:center; font-size:12px; color:#777;">
          💭 Whisperly – Where secrets find their voice.
        </p>
      </div>
    `,
  };

  try {
    const info = await sgMail.send(msg);
    console.log("Email sent:", info[0].statusCode);
    return info;
  } catch (error) {
    console.error("SendGrid error:", error.response?.body || error.message);
    throw error;
  }
};


