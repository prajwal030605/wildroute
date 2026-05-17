import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { leadId, agencyEmail, agencyName, leadName, leadEmail, leadPhone, message, groupSize, trekTitle } = await req.json();

    if (!agencyEmail || !leadEmail) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Email to the agency with lead details
    const { error: emailError } = await resend.emails.send({
      from: "WildRoute Leads <onboarding@resend.dev>",
      to: [agencyEmail],
      subject: `🔥 New Customer Lead — ${trekTitle || "WildRoute"} (${leadName})`,
      html: `
        <div style="font-family: sans-serif; max-width: 580px; margin: 0 auto; background: #0a0a0a; color: #fff; border-radius: 16px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #0F2A1E, #0a0a0a); padding: 32px; border-bottom: 1px solid #1a1a1a; text-align: center;">
            <h1 style="font-size: 22px; font-weight: 800; margin: 0 0 4px;">Wild<span style="color: #1D9E75;">Route</span></h1>
            <p style="color: #1D9E75; font-size: 13px; margin: 0; font-weight: 600; letter-spacing: 0.05em;">NEW CUSTOMER LEAD FOR YOU</p>
          </div>

          <div style="padding: 28px 32px;">
            <p style="color: #888; font-size: 14px; line-height: 1.7; margin: 0 0 24px;">
              Hi <strong style="color:#fff;">${agencyName}</strong>, a customer has enquired about your trek on WildRoute. Here are their contact details — please reach out within 24 hours.
            </p>

            <div style="background: #111; border: 1px solid #1D9E75; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
              <p style="color: #1D9E75; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; margin: 0 0 16px;">CUSTOMER DETAILS</p>
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #1a1a1a;">
                  <td style="padding: 8px 0; color: #666; font-size: 13px; width: 120px;">Name</td>
                  <td style="padding: 8px 0; color: #fff; font-size: 13px; font-weight: 600;">${leadName}</td>
                </tr>
                <tr style="border-bottom: 1px solid #1a1a1a;">
                  <td style="padding: 8px 0; color: #666; font-size: 13px;">Email</td>
                  <td style="padding: 8px 0; font-size: 13px;"><a href="mailto:${leadEmail}" style="color: #1D9E75;">${leadEmail}</a></td>
                </tr>
                ${leadPhone ? `<tr style="border-bottom: 1px solid #1a1a1a;">
                  <td style="padding: 8px 0; color: #666; font-size: 13px;">Phone</td>
                  <td style="padding: 8px 0; color: #fff; font-size: 13px; font-weight: 600;">${leadPhone}</td>
                </tr>` : ""}
                <tr style="border-bottom: 1px solid #1a1a1a;">
                  <td style="padding: 8px 0; color: #666; font-size: 13px;">Group size</td>
                  <td style="padding: 8px 0; color: #fff; font-size: 13px;">${groupSize || 1} person(s)</td>
                </tr>
                ${trekTitle ? `<tr style="border-bottom: 1px solid #1a1a1a;">
                  <td style="padding: 8px 0; color: #666; font-size: 13px;">Interested in</td>
                  <td style="padding: 8px 0; color: #fff; font-size: 13px; font-weight: 600;">${trekTitle}</td>
                </tr>` : ""}
                ${message ? `<tr>
                  <td style="padding: 8px 0; color: #666; font-size: 13px; vertical-align: top;">Message</td>
                  <td style="padding: 8px 0; color: #ccc; font-size: 13px; font-style: italic;">"${message}"</td>
                </tr>` : ""}
              </table>
            </div>

            <a href="mailto:${leadEmail}" style="display: inline-block; background: #1D9E75; color: #fff; padding: 12px 28px; border-radius: 8px; font-size: 14px; font-weight: 600; text-decoration: none; margin-bottom: 20px;">
              Reply to ${leadName} →
            </a>

            <p style="color: #444; font-size: 12px; margin: 0; line-height: 1.6;">
              This lead was sent to you by WildRoute. Please respond professionally and promptly.<br />
              Do not share or resell this customer's contact details.
            </p>
          </div>
        </div>
      `,
    });

    if (emailError) {
      return NextResponse.json({ error: "Failed to send email to agency." }, { status: 500 });
    }

    // Update lead status in Supabase to "forwarded"
    if (leadId) {
      await supabase
        .from("enquiries")
        .update({ status: "forwarded", forwarded_at: new Date().toISOString() })
        .eq("id", leadId);
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Forward lead error:", e);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
