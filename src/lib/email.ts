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

type RSVPEmailData = {
  to: string;
  guestName: string;
  attending: boolean;
  guests: number;
  guestList?: { name: string }[];
  comments?: string;
  locale?: string;
};

type InvitationEmailData = {
  to: string;
  guestName: string;
  locale?: string;
};

const i18n: Record<string, Record<string, string>> = {
  es: {
    rsvpConfirmation: 'Confirmaci&oacute;n RSVP',
    greeting: 'Querido/a',
    thanksMessage: 'Gracias por tomarte el tiempo de responder a nuestra invitaci&oacute;n. Tu respuesta ha sido registrada correctamente.',
    seeYou: 'Nos vemos en la boda',
    attendingConfirmed: 'Hemos registrado tu confirmaci&oacute;n de asistencia.',
    missYou: 'Te echaremos de menos',
    cantAttend: 'Sentimos que no puedas asistir. Te tendremos presente.',
    totalGuests: 'Total de invitados',
    youPlus: 't&uacute; +',
    companion: 'acompa&ntilde;ante',
    companions: 'acompa&ntilde;antes',
    guestListTitle: 'Acompa&ntilde;antes',
    yourMessage: 'Tu mensaje',
    eventDetails: 'Detalles del evento',
    date: 'Fecha',
    dateValue: 'S&aacute;bado, 25 de Julio de 2026',
    ceremony: 'Ceremonia',
    venue: 'Lugar',
    venueValue: 'M&aacute;s detalles en nuestra web',
    viewInfo: 'Ver toda la informaci&oacute;n',
    withLove: 'Con todo nuestro cari&ntilde;o,',
    autoEmail: 'Este email fue enviado autom&aacute;ticamente desde nuestra web de boda.',
    subjectAttending: 'Confirmacion recibida - Nos vemos en la boda',
    subjectNotAttending: 'Gracias por tu respuesta - Boda Estelle & Alexandre',
  },
  en: {
    rsvpConfirmation: 'RSVP Confirmation',
    greeting: 'Dear',
    thanksMessage: 'Thank you for taking the time to respond to our invitation. Your response has been recorded successfully.',
    seeYou: 'See you at the wedding',
    attendingConfirmed: 'We have registered your attendance confirmation.',
    missYou: 'We will miss you',
    cantAttend: 'We are sorry you cannot attend. You will be in our thoughts.',
    totalGuests: 'Total guests',
    youPlus: 'you +',
    companion: 'companion',
    companions: 'companions',
    guestListTitle: 'Companions',
    yourMessage: 'Your message',
    eventDetails: 'Event details',
    date: 'Date',
    dateValue: 'Saturday, July 25, 2026',
    ceremony: 'Ceremony',
    venue: 'Venue',
    venueValue: 'More details on our website',
    viewInfo: 'View all information',
    withLove: 'With all our love,',
    autoEmail: 'This email was sent automatically from our wedding website.',
    subjectAttending: 'Confirmation received - See you at the wedding',
    subjectNotAttending: 'Thank you for your response - Estelle & Alexandre Wedding',
  },
  fr: {
    rsvpConfirmation: 'Confirmation RSVP',
    greeting: 'Cher/Ch&egrave;re',
    thanksMessage: 'Merci d\'avoir pris le temps de r&eacute;pondre &agrave; notre invitation. Votre r&eacute;ponse a &eacute;t&eacute; enregistr&eacute;e avec succ&egrave;s.',
    seeYou: 'On se voit au mariage',
    attendingConfirmed: 'Nous avons enregistr&eacute; votre confirmation de pr&eacute;sence.',
    missYou: 'Vous allez nous manquer',
    cantAttend: 'Nous sommes d&eacute;sol&eacute;s que vous ne puissiez pas venir. Nous penserons &agrave; vous.',
    totalGuests: 'Total des invit&eacute;s',
    youPlus: 'vous +',
    companion: 'accompagnant',
    companions: 'accompagnants',
    guestListTitle: 'Accompagnants',
    yourMessage: 'Votre message',
    eventDetails: 'D&eacute;tails de l\'&eacute;v&eacute;nement',
    date: 'Date',
    dateValue: 'Samedi 25 Juillet 2026',
    ceremony: 'C&eacute;r&eacute;monie',
    venue: 'Lieu',
    venueValue: 'Plus de d&eacute;tails sur notre site web',
    viewInfo: 'Voir toutes les informations',
    withLove: 'Avec tout notre amour,',
    autoEmail: 'Cet email a &eacute;t&eacute; envoy&eacute; automatiquement depuis notre site de mariage.',
    subjectAttending: 'Confirmation reçue - On se voit au mariage',
    subjectNotAttending: 'Merci pour votre réponse - Mariage Estelle & Alexandre',
  },
};

function tr(locale: string, key: string): string {
  return i18n[locale]?.[key] || i18n.es[key] || key;
}

function buildRSVPEmail({ guestName, attending, guests, guestList, comments, locale = 'es' }: RSVPEmailData): string {
  const lang = i18n[locale] ? locale : 'es';

  const attendingSection = attending
    ? `
      <div style="background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%); border-radius: 16px; padding: 24px; margin: 24px 0; border-left: 4px solid #E8B4B8;">
        <p style="margin: 0; font-size: 18px; color: #9d174d; font-weight: 600;">
          ${tr(lang, 'seeYou')}
        </p>
        <p style="margin: 8px 0 0 0; color: #be185d; font-size: 14px;">
          ${tr(lang, 'attendingConfirmed')}
        </p>
      </div>`
    : `
      <div style="background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%); border-radius: 16px; padding: 24px; margin: 24px 0; border-left: 4px solid #C9A7C7;">
        <p style="margin: 0; font-size: 18px; color: #6b21a8; font-weight: 600;">
          ${tr(lang, 'missYou')}
        </p>
        <p style="margin: 8px 0 0 0; color: #7c3aed; font-size: 14px;">
          ${tr(lang, 'cantAttend')}
        </p>
      </div>`;

  const guestListHtml = guestList && guestList.length > 0
    ? `
      <div style="background: #faf5ff; border-radius: 12px; padding: 20px; margin: 16px 0;">
        <p style="margin: 0 0 12px 0; font-size: 14px; color: #C9A7C7; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
          ${tr(lang, 'guestListTitle')}
        </p>
        ${guestList.map((g) => `
          <div style="display: flex; align-items: center; padding: 8px 0; border-bottom: 1px solid #ede9fe;">
            <span style="color: #C9A7C7; margin-right: 8px; font-size: 8px;">&#9670;</span>
            <span style="color: #4A4A4A; font-size: 15px;">${escapeHtml(g.name)}</span>
          </div>
        `).join('')}
      </div>`
    : '';

  const commentsHtml = comments
    ? `
      <div style="background: linear-gradient(135deg, #FFF9F5 0%, #fef7f0 100%); border-radius: 12px; padding: 20px; margin: 16px 0;">
        <p style="margin: 0 0 8px 0; font-size: 14px; color: #D4AF97; font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">
          ${tr(lang, 'yourMessage')}
        </p>
        <p style="margin: 0; color: #78716c; font-size: 15px; font-style: italic; line-height: 1.6;">
          &ldquo;${escapeHtml(comments)}&rdquo;
        </p>
      </div>`
    : '';

  return `
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${tr(lang, 'rsvpConfirmation')}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FFF9F5; font-family: 'Georgia', 'Times New Roman', serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FFF9F5;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; width: 100%;">
          
          <!-- Header with gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #E8B4B8 0%, #C9A7C7 50%, #D4AF97 100%); border-radius: 24px 24px 0 0; padding: 48px 40px; text-align: center;">
              <div style="font-size: 14px; color: rgba(255,255,255,0.7); letter-spacing: 6px; text-transform: uppercase; margin-bottom: 20px;">&#10043; &middot; &#10043;</div>
              
              <h1 style="margin: 0; font-size: 36px; color: #ffffff; font-weight: 300; letter-spacing: 2px; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                Estelle <span style="font-style: italic; font-weight: 200;">&amp;</span> Alexandre
              </h1>
              
              <div style="width: 60px; height: 1px; background: rgba(255,255,255,0.6); margin: 20px auto;"></div>
              
              <p style="margin: 0; font-size: 13px; color: rgba(255,255,255,0.85); letter-spacing: 4px; text-transform: uppercase; font-weight: 300;">
                ${tr(lang, 'rsvpConfirmation')}
              </p>
            </td>
          </tr>

          <!-- Main content -->
          <tr>
            <td style="background: #ffffff; padding: 40px; border-left: 1px solid #f3e8e8; border-right: 1px solid #f3e8e8;">
              
              <!-- Greeting -->
              <p style="font-size: 15px; color: #9ca3af; margin: 0 0 6px 0; font-weight: 300; text-transform: uppercase; letter-spacing: 2px;">
                ${tr(lang, 'greeting')}
              </p>
              <p style="font-size: 28px; color: #E8B4B8; margin: 0 0 24px 0; font-weight: 400; font-style: italic;">
                ${escapeHtml(guestName)}
              </p>

              <div style="width: 40px; height: 2px; background: linear-gradient(to right, #E8B4B8, #C9A7C7); margin: 0 0 24px 0; border-radius: 1px;"></div>

              <p style="font-size: 16px; color: #6b7280; line-height: 1.8; margin: 0 0 16px 0;">
                ${tr(lang, 'thanksMessage')}
              </p>

              ${attendingSection}

              ${attending && guests > 0 ? `
              <div style="background: linear-gradient(135deg, #FFF9F5 0%, #fdf2f8 100%); border-radius: 12px; padding: 20px; margin: 16px 0; text-align: center;">
                <p style="margin: 0 0 4px 0; font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 2px;">
                  ${tr(lang, 'totalGuests')}
                </p>
                <p style="margin: 0; font-size: 36px; color: #E8B4B8; font-weight: 300;">
                  ${guests + 1}
                </p>
                <p style="margin: 4px 0 0 0; font-size: 13px; color: #9ca3af;">
                  (${tr(lang, 'youPlus')} ${guests} ${guests > 1 ? tr(lang, 'companions') : tr(lang, 'companion')})
                </p>
              </div>
              ` : ''}

              ${guestListHtml}
              ${commentsHtml}

              ${attending ? `
              <!-- Wedding details -->
              <div style="background: linear-gradient(135deg, #FFF9F5 0%, #fef7f0 100%); border-radius: 16px; padding: 28px; margin: 28px 0; border: 1px solid #f3e8e8;">
                <p style="margin: 0 0 20px 0; font-size: 12px; color: #D4AF97; font-weight: 600; text-transform: uppercase; letter-spacing: 3px;">
                  ${tr(lang, 'eventDetails')}
                </p>
                
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="padding: 10px 0; vertical-align: top; width: 24px;">
                      <span style="font-size: 11px; color: #D4AF97;">&#9670;</span>
                    </td>
                    <td style="padding: 10px 0;">
                      <p style="margin: 0; font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 2px;">${tr(lang, 'date')}</p>
                      <p style="margin: 4px 0 0 0; font-size: 16px; color: #4A4A4A;">${tr(lang, 'dateValue')}</p>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" style="padding: 0;"><div style="height: 1px; background: #f3e8e8; margin: 4px 0;"></div></td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; vertical-align: top; width: 24px;">
                      <span style="font-size: 11px; color: #D4AF97;">&#9670;</span>
                    </td>
                    <td style="padding: 10px 0;">
                      <p style="margin: 0; font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 2px;">${tr(lang, 'ceremony')}</p>
                      <p style="margin: 4px 0 0 0; font-size: 16px; color: #4A4A4A;">16:00h</p>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" style="padding: 0;"><div style="height: 1px; background: #f3e8e8; margin: 4px 0;"></div></td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; vertical-align: top; width: 24px;">
                      <span style="font-size: 11px; color: #D4AF97;">&#9670;</span>
                    </td>
                    <td style="padding: 10px 0;">
                      <p style="margin: 0; font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 2px;">${tr(lang, 'venue')}</p>
                      <p style="margin: 4px 0 0 0; font-size: 16px; color: #4A4A4A;">${tr(lang, 'venueValue')}</p>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${process.env.NEXTAUTH_URL || 'https://estelle-alexandre.bodasaliugo.com'}/informacion" 
                   style="display: inline-block; background: linear-gradient(135deg, #E8B4B8, #C9A7C7); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; font-weight: 600; box-shadow: 0 4px 15px rgba(232, 180, 184, 0.4);">
                  ${tr(lang, 'viewInfo')}
                </a>
              </div>
              ` : ''}

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: linear-gradient(135deg, #E8B4B8 0%, #C9A7C7 50%, #D4AF97 100%); border-radius: 0 0 24px 24px; padding: 32px 40px; text-align: center;">
              <div style="font-size: 14px; color: rgba(255,255,255,0.5); letter-spacing: 4px; margin-bottom: 12px;">&#10043;</div>
              <p style="margin: 0 0 4px 0; font-size: 14px; color: rgba(255,255,255,0.9); font-weight: 300; letter-spacing: 1px;">
                ${tr(lang, 'withLove')}
              </p>
              <p style="margin: 0 0 16px 0; font-size: 20px; color: #ffffff; font-weight: 400; font-style: italic;">
                Estelle <span style="font-weight: 200;">&amp;</span> Alexandre
              </p>
              <div style="width: 40px; height: 1px; background: rgba(255,255,255,0.4); margin: 0 auto 16px auto;"></div>
              <p style="margin: 0; font-size: 12px; color: rgba(255,255,255,0.6);">
                ${tr(lang, 'autoEmail')}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildInvitationEmail({ guestName, locale = 'es' }: InvitationEmailData): string {
  const lang = i18n[locale] ? locale : 'es';
  const siteUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://estelle-alexandre.bodasaliugo.com';

  const copy = {
    es: {
      title: 'Invitacion de boda',
      greeting: 'Querido/a',
      intro: 'Nos hace muchisima ilusion invitarte a celebrar nuestra boda con nosotros.',
      cta: 'Confirmar asistencia',
      details: 'En nuestra web encontraras la informacion del evento y el formulario RSVP.',
      footer: 'Con todo nuestro carino,',
      subject: 'Invitacion de boda - Estelle & Alexandre',
    },
    en: {
      title: 'Wedding invitation',
      greeting: 'Dear',
      intro: 'We are so excited to invite you to celebrate our wedding with us.',
      cta: 'Confirm attendance',
      details: 'On our website you will find the event details and the RSVP form.',
      footer: 'With all our love,',
      subject: 'Wedding invitation - Estelle & Alexandre',
    },
    fr: {
      title: 'Invitation de mariage',
      greeting: 'Cher/Chere',
      intro: 'Nous sommes tres heureux de vous inviter a celebrer notre mariage avec nous.',
      cta: 'Confirmer votre presence',
      details: 'Sur notre site, vous trouverez les informations de l evenement et le formulaire RSVP.',
      footer: 'Avec tout notre amour,',
      subject: 'Invitation de mariage - Estelle & Alexandre',
    },
  }[lang] || {
    title: 'Invitacion de boda',
    greeting: 'Querido/a',
    intro: 'Nos hace muchisima ilusion invitarte a celebrar nuestra boda con nosotros.',
    cta: 'Confirmar asistencia',
    details: 'En nuestra web encontraras la informacion del evento y el formulario RSVP.',
    footer: 'Con todo nuestro carino,',
    subject: 'Invitacion de boda - Estelle & Alexandre',
  };

  return `
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${copy.title}</title>
</head>
<body style="margin:0; padding:0; background:#fff7fb; font-family: Georgia, 'Times New Roman', serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px; width:100%; background:#ffffff; border-radius:28px; overflow:hidden; border:1px solid #f3e8ff;">
          <tr>
            <td style="background:linear-gradient(135deg,#7c3aed,#c084fc); padding:48px 36px; text-align:center;">
              <p style="margin:0 0 14px 0; color:rgba(255,255,255,.78); letter-spacing:5px; text-transform:uppercase; font-size:12px;">${copy.title}</p>
              <h1 style="margin:0; color:#ffffff; font-size:38px; font-weight:400;">Estelle &amp; Alexandre</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:42px 36px; text-align:center;">
              <p style="margin:0 0 8px 0; color:#8b5cf6; letter-spacing:2px; text-transform:uppercase; font-size:12px;">${copy.greeting}</p>
              <p style="margin:0 0 24px 0; color:#4c1d95; font-size:30px; font-style:italic;">${escapeHtml(guestName)}</p>
              <p style="margin:0 auto 18px auto; max-width:460px; color:#57534e; font-size:17px; line-height:1.8;">${copy.intro}</p>
              <p style="margin:0 auto 30px auto; max-width:460px; color:#78716c; font-size:15px; line-height:1.7;">${copy.details}</p>
              <a href="${siteUrl}/rsvp" style="display:inline-block; background:linear-gradient(135deg,#7c3aed,#a855f7); color:#ffffff; text-decoration:none; padding:16px 34px; border-radius:999px; font-size:13px; letter-spacing:2px; text-transform:uppercase; font-weight:700;">${copy.cta}</a>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 36px; text-align:center; background:#faf5ff;">
              <p style="margin:0 0 6px 0; color:#7c3aed; font-size:14px;">${copy.footer}</p>
              <p style="margin:0; color:#4c1d95; font-size:22px; font-style:italic;">Estelle &amp; Alexandre</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendRSVPConfirmation(data: RSVPEmailData): Promise<void> {
  const fromAddress = process.env.SMTP_FROM || 'estelle-alexandre@bodasaliugo.com';
  const lang = data.locale && i18n[data.locale] ? data.locale : 'es';

  const html = buildRSVPEmail(data);

  await transporter.sendMail({
    from: `"Estelle & Alexandre" <${fromAddress}>`,
    to: data.to,
    subject: data.attending
      ? tr(lang, 'subjectAttending')
      : tr(lang, 'subjectNotAttending'),
    html,
  });
}

export async function sendWeddingInvitation(data: InvitationEmailData): Promise<void> {
  const fromAddress = process.env.SMTP_FROM || 'estelle-alexandre@bodasaliugo.com';
  const lang = data.locale && i18n[data.locale] ? data.locale : 'es';
  const html = buildInvitationEmail(data);
  const subject = {
    es: 'Invitacion de boda - Estelle & Alexandre',
    en: 'Wedding invitation - Estelle & Alexandre',
    fr: 'Invitation de mariage - Estelle & Alexandre',
  }[lang] || 'Invitacion de boda - Estelle & Alexandre';

  await transporter.sendMail({
    from: `"Estelle & Alexandre" <${fromAddress}>`,
    to: data.to,
    subject,
    html,
  });
}
