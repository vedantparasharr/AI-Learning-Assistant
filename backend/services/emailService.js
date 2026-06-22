
export const sendOtpEmail = async ({ toEmail, username, otp }) => {
  const fromEmail = process.env.EMAIL_FROM;
  const apiKey = process.env.BREVO_API_KEY;
  const appName = process.env.APP_NAME || "DistillLearn";

  if (!fromEmail) {
    throw new Error("EMAIL_FROM must be configured");
  }

  if (!apiKey) {
    throw new Error("BREVO_API_KEY must be configured");
  }

  const html = `
  <div style="margin:0;padding:40px 16px;background:#f8fafc;font-family:Segoe UI, Arial, sans-serif;color:#0f172a;">
    <table width="100%" style="max-width:480px;margin:0 auto;">
      <tr>
        <td style="text-align:center;">
          <h1 style="margin:0 0 8px;font-size:28px;font-weight:700;color:#2563eb;">
            DistillLearn
          </h1>
          <p style="margin:0 0 24px;font-size:14px;color:#64748b;">
            Verify your email
          </p>
          <div style="background:#ffffff;border-radius:12px;padding:28px 24px;border:1px solid #e2e8f0;">
            <p style="margin:0 0 12px;font-size:15px;">
              Hi ${username},
            </p>
            <p style="margin:0 0 20px;font-size:14px;color:#475569;">
              Enter this code to verify your account.
            </p>
            <div style="margin:0 0 20px;padding:16px;border-radius:10px;background:#f1f5f9;border:1px solid #e2e8f0;">
              <p style="margin:0;font-size:32px;letter-spacing:8px;font-weight:700;">
                ${otp}
              </p>
            </div>
            <p style="margin:0 0 6px;font-size:13px;color:#64748b;">
              This code expires in 10 minutes.
            </p>
            <p style="margin:0;font-size:12px;color:#94a3b8;">
              If you didn’t request this, you can ignore this email.
            </p>
          </div>
          <p style="margin-top:20px;font-size:12px;color:#94a3b8;">
            © DistillLearn
          </p>
        </td>
      </tr>
    </table>
  </div>
`;

  const text = [
    "DistillLearn - Confirm your email",
    "",
    `Hi ${username},`,
    "",
    "Use this one-time password to verify your email:",
    otp,
    "",
    "This code expires in 10 minutes.",
    "If you did not create this account, you can ignore this email.",
  ].join("\n");

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: {
        name: appName,
        email: fromEmail,
      },
      to: [
        {
          email: toEmail,
          name: username,
        },
      ],
      subject: "Verify your email - DistillLearn",
      htmlContent: html,
      textContent: text,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Brevo API failed (${response.status}): ${message}`);
  }
};
