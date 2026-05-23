const { Resend } = require("resend");

const getResendClient = () => {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }

  return new Resend(process.env.RESEND_API_KEY);
};

const sendEmail = async ({
  to,
  subject,
  html,
  text,
}) => {
  const resend = getResendClient();

  if (!resend) {
    console.warn("RESEND_API_KEY is missing. Email not sent.");
    return null;
  }

  const wrappedHtml = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${subject}</title>
    </head>
    <body style="
      margin: 0;
      padding: 0;
      background: #020617;
      font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #e2e8f0;
    ">
      <table
        width="100%"
        cellpadding="0"
        cellspacing="0"
        style="background: #020617; padding: 40px 20px;"
      >
        <tr>
          <td align="center">
            <table
              width="100%"
              cellpadding="0"
              cellspacing="0"
              style="
                max-width: 640px;
                background: linear-gradient(180deg, #0f172a 0%, #020617 100%);
                border: 1px solid rgba(148, 163, 184, 0.12);
                border-radius: 24px;
                overflow: hidden;
                box-shadow:
                  0 20px 60px rgba(0, 0, 0, 0.45),
                  inset 0 1px 0 rgba(255,255,255,0.03);
              "
            >
              <!-- Header -->
              <tr>
                <td
                  style="
                    padding: 40px 48px 24px;
                    background:
                      radial-gradient(circle at top right, rgba(59,130,246,0.18), transparent 40%),
                      radial-gradient(circle at top left, rgba(14,165,233,0.12), transparent 35%);
                  "
                >
                  <div
                    style="
                      font-size: 28px;
                      font-weight: 800;
                      color: #ffffff;
                      letter-spacing: -0.03em;
                    "
                  >
                    Neurovenus
                  </div>

                  <div
                    style="
                      margin-top: 8px;
                      font-size: 14px;
                      color: #94a3b8;
                      line-height: 1.6;
                    "
                  >
                    Remote cognitive and sleep research platform
                  </div>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td
                  style="
                    padding: 0 48px 48px;
                    font-size: 16px;
                    line-height: 1.8;
                    color: #cbd5e1;
                  "
                >
                  ${html}
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td
                  style="
                    padding: 24px 48px 40px;
                    border-top: 1px solid rgba(148, 163, 184, 0.08);
                    font-size: 13px;
                    line-height: 1.7;
                    color: #64748b;
                  "
                >
                  You are receiving this email because you were invited to
                  participate in a study hosted on Neurovenus.

                  <br /><br />

                  Questions? Contact the study team or reply to this email.

                  <br /><br />

                  <span style="color: #475569;">
                    © ${new Date().getFullYear()} Neurovenus.
                    All rights reserved.
                  </span>
                </td>
              </tr>
            </table>

            <div
              style="
                margin-top: 18px;
                font-size: 12px;
                color: #475569;
              "
            >
              Secure research infrastructure for cognitive science.
            </div>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;

  const { data, error } = await resend.emails.send({
    from:
      process.env.EMAIL_FROM ||
      "Neurovenus Research <onboarding@resend.dev>",
    to,
    subject,
    html: wrappedHtml,
    text,
  });

  if (error) {
    console.error("Resend email error:", error);
    return null;
  }

  console.log("Resend email accepted:", data);
  return data;
};

const sendParticipantInviteEmail = async ({
  to,
  participantCode,
  inviteLink,
  studyTitle,
}) => {
  const subject = `You're invited to participate in ${studyTitle}`;

  const text = `
You have been invited to participate in ${studyTitle}.

Participant Code: ${participantCode}

Start your study session:
${inviteLink}
  `.trim();

  const html = `
    <div style="padding-top: 8px;">
      <p style="
        margin: 0 0 18px;
        color: #e2e8f0;
        font-size: 18px;
        font-weight: 700;
        line-height: 1.5;
      ">
        You have been invited to participate in a research study.
      </p>

      <p style="
        margin: 0 0 22px;
        color: #cbd5e1;
        font-size: 15px;
        line-height: 1.8;
      ">
        The study team has invited you to complete a remote assessment session
        for <strong style="color:#ffffff;">${studyTitle}</strong>.
      </p>

      <div style="
        margin: 26px 0;
        padding: 18px 20px;
        border-radius: 18px;
        background: rgba(15, 23, 42, 0.88);
        border: 1px solid rgba(148, 163, 184, 0.14);
      ">
        <p style="
          margin: 0 0 6px;
          color: #94a3b8;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        ">
          Participant Code
        </p>

        <p style="
          margin: 0;
          color: #67e8f9;
          font-size: 24px;
          font-weight: 800;
          letter-spacing: 0.08em;
        ">
          ${participantCode}
        </p>
      </div>

      <p style="
        margin: 0 0 28px;
        color: #cbd5e1;
        font-size: 15px;
        line-height: 1.8;
      ">
        Please click the secure button below to begin when you are ready.
      </p>

      <a
        href="${inviteLink}"
        style="
          display: inline-block;
          padding: 14px 24px;
          border-radius: 14px;
          background: linear-gradient(90deg, #0ea5e9, #2563eb);
          color: #ffffff;
          text-decoration: none;
          font-size: 15px;
          font-weight: 800;
          box-shadow: 0 12px 28px rgba(37, 99, 235, 0.25);
        "
      >
        Start Study Session
      </a>

      <p style="
        margin: 28px 0 0;
        color: #94a3b8;
        font-size: 13px;
        line-height: 1.7;
      ">
        If the button does not work, copy and paste this secure link into your browser:
      </p>

      <p style="
        margin: 8px 0 0;
        color: #67e8f9;
        font-size: 13px;
        line-height: 1.7;
        word-break: break-all;
      ">
        ${inviteLink}
      </p>
    </div>
  `;

  return sendEmail({
    to,
    subject,
    html,
    text,
  });
};

const sendResearcherInviteEmail = async ({
  to,
  inviteLink,
  organizationName,
  inviterName,
}) => {
  const subject = `You're invited to join ${organizationName || "Neurovenus"}`;

  const html = `
    <div style="padding-top: 8px;">
      <p style="
        margin: 0 0 18px;
        color: #e2e8f0;
        font-size: 18px;
        font-weight: 700;
        line-height: 1.5;
      ">
        You're invited to join a Neurovenus research workspace.
      </p>

      <p style="
        margin: 0 0 22px;
        color: #cbd5e1;
        font-size: 15px;
        line-height: 1.8;
      ">
        <strong style="color:#ffffff;">
          ${inviterName || "A workspace owner"}
        </strong>
        has invited you to collaborate on
        <strong style="color:#ffffff;">
          ${organizationName || "a Neurovenus workspace"}
        </strong>.
      </p>

      <div style="
        margin: 26px 0;
        padding: 18px 20px;
        border-radius: 18px;
        background: rgba(15, 23, 42, 0.88);
        border: 1px solid rgba(148, 163, 184, 0.14);
      ">
        <p style="
          margin: 0;
          color: #94a3b8;
          font-size: 14px;
          line-height: 1.8;
        ">
          Neurovenus enables remote cognitive and sleep research with:
        </p>

        <ul style="
          margin: 14px 0 0;
          padding-left: 18px;
          color: #cbd5e1;
          font-size: 14px;
          line-height: 1.9;
        ">
          <li>Multi-session study management</li>
          <li>Remote participant invitations</li>
          <li>Cognitive & sleep assessments</li>
          <li>Trial-level data capture</li>
          <li>Analysis-ready CSV exports</li>
        </ul>
      </div>

      <p style="
        margin: 0 0 28px;
        color: #cbd5e1;
        font-size: 15px;
        line-height: 1.8;
      ">
        Click below to activate your researcher account and join the workspace.
      </p>

      <a
        href="${inviteLink}"
        style="
          display: inline-block;
          padding: 14px 24px;
          border-radius: 14px;
          background: linear-gradient(90deg, #0ea5e9, #2563eb);
          color: #ffffff;
          text-decoration: none;
          font-size: 15px;
          font-weight: 800;
          box-shadow: 0 12px 28px rgba(37, 99, 235, 0.25);
        "
      >
        Accept Researcher Invite
      </a>

      <p style="
        margin: 28px 0 0;
        color: #94a3b8;
        font-size: 13px;
        line-height: 1.7;
      ">
        This invitation expires in 7 days.
      </p>

      <p style="
        margin: 8px 0 0;
        color: #67e8f9;
        font-size: 13px;
        line-height: 1.7;
        word-break: break-all;
      ">
        ${inviteLink}
      </p>
    </div>
  `;

  return sendEmail({
    to,
    subject,
    html,
  });
};

const sendSessionReminderEmail = async ({
  to,
  participantCode,
  sessionName,
  studyTitle,
  sessionLink,
  opensAt,
  expiresAt,
}) => {
  const timingText = expiresAt
    ? `This session is available until ${new Date(expiresAt).toLocaleString()}.`
    : "This session is now available.";

  return sendEmail({
    to,
    subject: `Your next Neurovenus session is available`,
    text: `Your next session for ${studyTitle} is now available.

Participant ID: ${participantCode}
Session: ${sessionName}

${timingText}

Continue here: ${sessionLink}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Your next study session is available</h2>

        <p>Your next session for <strong>${studyTitle}</strong> is ready.</p>

        <p><strong>Participant ID:</strong> ${participantCode}</p>
        <p><strong>Session:</strong> ${sessionName}</p>
        <p>${timingText}</p>

        <p>
          <a href="${sessionLink}" style="display:inline-block;padding:12px 18px;background:#2563eb;color:white;text-decoration:none;border-radius:8px;">
            Continue Session
          </a>
        </p>

        <p>If the button does not work, copy and paste this link into your browser:</p>
        <p>${sessionLink}</p>
      </div>
    `,
  });
};

module.exports = {
  sendEmail,
  sendParticipantInviteEmail,
  sendSessionReminderEmail,
  sendResearcherInviteEmail,
};