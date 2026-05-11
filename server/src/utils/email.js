const { Resend } = require("resend");

const getResendClient = () => {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }

  return new Resend(process.env.RESEND_API_KEY);
};

const sendEmail = async ({ to, subject, html, text }) => {
  const resend = getResendClient();

  if (!resend) {
    console.warn("RESEND_API_KEY is missing. Email not sent.");
    return null;
  }

  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || "Neurovenus <onboarding@resend.dev>",
    to,
    subject,
    html,
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
  return sendEmail({
    to,
    subject: `Your invitation to ${studyTitle}`,
    text: `You have been invited to take part in ${studyTitle}.

Participant ID: ${participantCode}

Start here: ${inviteLink}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>${studyTitle}</h2>
        <p>You have been invited to take part in this research study.</p>
        <p><strong>Participant ID:</strong> ${participantCode}</p>

        <p>
          <a href="${inviteLink}" style="display:inline-block;padding:12px 18px;background:#2563eb;color:white;text-decoration:none;border-radius:8px;">
            Start Study
          </a>
        </p>

        <p>If the button does not work, copy and paste this link into your browser:</p>
        <p>${inviteLink}</p>
      </div>
    `,
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
};