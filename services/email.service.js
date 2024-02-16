const { sendGrid } = require("../config/sendgrid");

/**
 * Send an email
 * @param {string} to
 * @returns {Promise}
 */
const sendVerificationEmailBuyer = async (to, user, token) => {
  const email = await sendGrid.send({
    from: {
      email: "info@ugc.nl",
    },
    personalizations: [
      {
        to: [
          {
            email: to,
          },
        ],
        dynamicTemplateData: {
          url: `${process.env.FRONTEND_URL}/verify-email?token=${token}`,
          name: user.firstName,
        },
      },
    ],
    template_id: "d-a1f56837720440bc8ff95238d803e4a2",
  });

  return email;
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
  const msg = {
    to,
    from: "info@ugc.nl",
    subject: "Wachtwoord vergeten UGC.nl",
    html: `<div style='font-family: Arial'><h1 style='font-size:22px'>Wachtwoord vergeten UGC.nl</h1><p>Je ontvangt deze email omdat je je wachtwoord bent vergeten. Klik hieronder om je wachtwoord te wijzigen.</p><a href=${`${process.env.FRONTEND_URL}/forgot-password/?token=${token}`} target='_blank'><button style='background-color:#2181e2;border:none;padding:10px;color:white;cursor:pointer'>Wachtwoord resetten</button></a></div>`,
  };

  const email = await sendGrid.send(msg);

  return email;
};

module.exports = {
  sendVerificationEmailBuyer,
  sendResetPasswordEmail,
};
