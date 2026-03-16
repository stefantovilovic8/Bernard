const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { ime, priimek, telefon, email, storitev, sporocilo } = req.body;

  if (!ime || !email || !sporocilo) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await resend.emails.send({
      from: 'Prva Izbira <onboarding@resend.dev>',
      to: 'bregantbernard85@gmail.com',
      reply_to: email,
      subject: `Novo povpraševanje – ${storitev || 'Splošno'}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="color:#0b1f3a;border-bottom:2px solid #4a9fd4;padding-bottom:0.5rem;">
            Novo povpraševanje – Prva Izbira
          </h2>
          <table style="width:100%;border-collapse:collapse;margin-top:1rem;">
            <tr><td style="padding:8px 0;color:#666;width:130px;"><strong>Ime in priimek</strong></td><td style="padding:8px 0;">${ime} ${priimek || ''}</td></tr>
            <tr><td style="padding:8px 0;color:#666;"><strong>Telefon</strong></td><td style="padding:8px 0;">${telefon || '–'}</td></tr>
            <tr><td style="padding:8px 0;color:#666;"><strong>E-mail</strong></td><td style="padding:8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#666;"><strong>Storitev</strong></td><td style="padding:8px 0;">${storitev || '–'}</td></tr>
          </table>
          <div style="margin-top:1.5rem;padding:1rem;background:#f7f7f5;border-radius:8px;">
            <strong style="color:#666;">Sporočilo:</strong>
            <p style="margin:0.5rem 0 0;">${sporocilo}</p>
          </div>
          <p style="margin-top:2rem;font-size:0.85rem;color:#aaa;">Poslano prek kontaktnega obrazca na prvaizbira.si</p>
        </div>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Resend error:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
};
