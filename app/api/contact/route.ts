import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createServiceRoleClient } from "@/lib/supabaseServer";

const resend = new Resend(process.env.RESEND_API_KEY);

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message } = body ?? {};

    // ── Validation ───────────────────────────────────────────────────────────
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    // ── Save to Supabase ─────────────────────────────────────────────────────
    const supabase = await createServiceRoleClient();
    const { error: dbError } = await supabase
      .from("contacts")
      .insert({ name: name.trim(), email: email.trim(), message: message.trim() });

    if (dbError) {
      console.error("Supabase insert error:", dbError.message);
      return NextResponse.json({ error: "Failed to save your message. Please try again." }, { status: 500 });
    }

    // ── Send notification email via Resend ───────────────────────────────────
    const notificationEmail = process.env.CONTACT_NOTIFICATION_EMAIL;
    if (notificationEmail) {
      try {
        await resend.emails.send({
          from: "Shëngjin Stay <onboarding@resend.dev>",
          to: notificationEmail,
          subject: `New inquiry from ${name.trim()}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #f6f8f8;">
              <div style="background: #1a7a6d; padding: 24px; margin-bottom: 24px;">
                <h1 style="color: white; margin: 0; font-size: 22px; letter-spacing: 2px; text-transform: uppercase;">
                  New Inquiry — Shëngjin Stay
                </h1>
              </div>
              <div style="background: white; padding: 32px; border: 1px solid #e0e8e6;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr style="border-bottom: 1px solid #e0e8e6;">
                    <td style="padding: 12px 0; font-weight: 700; color: #668580; width: 100px; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Name</td>
                    <td style="padding: 12px 0; color: #121716;">${name.trim()}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e0e8e6;">
                    <td style="padding: 12px 0; font-weight: 700; color: #668580; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Email</td>
                    <td style="padding: 12px 0; color: #121716;"><a href="mailto:${email.trim()}" style="color: #1a7a6d;">${email.trim()}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; font-weight: 700; color: #668580; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; vertical-align: top;">Message</td>
                    <td style="padding: 12px 0; color: #121716; white-space: pre-wrap;">${message.trim()}</td>
                  </tr>
                </table>
              </div>
              <p style="color: #668580; font-size: 12px; margin-top: 24px; text-align: center;">
                Received ${new Date().toUTCString()} · Shëngjin Stay
              </p>
            </div>
          `,
        });
      } catch (resendError) {
        // Data is saved — don't fail the request over email error
        console.error("Resend error:", resendError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json({ error: "Unexpected error. Please try again." }, { status: 500 });
  }
}
