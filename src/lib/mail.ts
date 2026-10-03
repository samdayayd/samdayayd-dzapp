import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM = process.env.EMAIL_FROM || "DZ APP <onboarding@resend.dev>";

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  if (!resend) {
    console.warn(
      "[mail] RESEND_API_KEY not set — skipping password reset email. Reset URL:",
      resetUrl
    );
    return;
  }

  // The Resend SDK doesn't throw on an API-level failure (invalid key,
  // unverified sending domain, the default onboarding@resend.dev sender
  // being restricted to the account's own address, etc.) — it resolves
  // normally with an `error` field instead. Previously that field was
  // never checked, so a rejected send looked identical to a delivered
  // one: this route always returned ok:true regardless (deliberately, to
  // not leak which emails are registered), so the failure was completely
  // invisible anywhere except here.
  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject: "Réinitialisez votre mot de passe DZ APP",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #147a4c;">DZ APP</h2>
        <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
        <p>
          <a href="${resetUrl}" style="display:inline-block;background:#147a4c;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;">
            Réinitialiser mon mot de passe
          </a>
        </p>
        <p style="color:#666;font-size:13px;">Ce lien expire dans 1 heure. Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
      </div>
    `,
  });

  if (error) {
    console.error("[mail] Resend rejected the password reset email:", error, "Reset URL:", resetUrl);
  }
}
