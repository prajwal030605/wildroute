import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const ADMIN_EMAIL = "bhavyabuddy7@gmail.com";

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { name, email, phone, message, groupSize, trekTitle, agencyEmail, agencyName } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }

    // 1. Save lead to Supabase
    const { data: lead, error: dbError } = await supabase
      .from("enquiries")
      .insert([{
        name,
        email,
        phone: phone || null,
        message: message || null,
        group_size: parseInt(groupSize) || 1,
        trek_title: trekTitle || null,
        agency_email: agencyEmail || null,
        agency_name: agencyName || null,
        status: "new",
      }])
      .select("id")
      .single();

    if (dbError) {
      console.error("DB error:", dbError);
      return NextResponse.json({ error: "Failed to save enquiry." }, { status: 500 });
    }

    // 2. Email admin with lead details
    await resend.emails.send({
      from: "WildRoute Leads <team@gowildroute.com>",
      to: [ADMIN_EMAIL],
      subject: `🔔 New Lead — ${trekTitle || agencyName || "WildRoute"} (${name})`,
      html: `
        <div style="font-family: sans-serif; max-width: 580px; margin: 0 auto; background: #0a0a0a; color: #fff; border-radius: 16px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #0F2A1E, #0a0a0a); padding: 32px; border-bottom: 1px solid #1a1a1a; text-align: center;">
            <h1 style="font-size: 22px; font-weight: 800; margin: 0 0 4px;">Wild<span style="color: #1D9E75;">Route</span></h1>
            <p style="color: #1D9E75; font-size: 13px; margin: 0; font-weight: 600; letter-spacing: 0.05em;">NEW LEAD RECEIVED</p>
          </div>

          <div style="padding: 28px 32px;">
            <h2 style="color: #fff; font-size: 18px; margin: 0 0 20px;">📋 Lead Details</h2>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tr style="border-bottom: 1px solid #1a1a1a;">
                <td style="padding: 10px 0; color: #666; font-size: 13px; width: 130px;">Name</td>
                <td style="padding: 10px 0; color: #fff; font-size: 13px; font-weight: 600;">${name}</td>
              </tr>
              <tr style="border-bottom: 1px solid #1a1a1a;">
                <td style="padding: 10px 0; color: #666; font-size: 13px;">Email</td>
                <td style="padding: 10px 0; color: #1D9E75; font-size: 13px;">${email}</td>
              </tr>
              ${phone ? `<tr style="border-bottom: 1px solid #1a1a1a;">
                <td style="padding: 10px 0; color: #666; font-size: 13px;">Phone</td>
                <td style="padding: 10px 0; color: #fff; font-size: 13px;">${phone}</td>
              </tr>` : ""}
              <tr style="border-bottom: 1px solid #1a1a1a;">
                <td style="padding: 10px 0; color: #666; font-size: 13px;">Group size</td>
                <td style="padding: 10px 0; color: #fff; font-size: 13px;">${groupSize || 1} person(s)</td>
              </tr>
              ${trekTitle ? `<tr style="border-bottom: 1px solid #1a1a1a;">
                <td style="padding: 10px 0; color: #666; font-size: 13px;">Trek / Activity</td>
                <td style="padding: 10px 0; color: #fff; font-size: 13px; font-weight: 600;">${trekTitle}</td>
              </tr>` : ""}
              ${agencyName ? `<tr style="border-bottom: 1px solid #1a1a1a;">
                <td style="padding: 10px 0; color: #666; font-size: 13px;">Agency</td>
                <td style="padding: 10px 0; color: #fff; font-size: 13px;">${agencyName}</td>
              </tr>` : ""}
              ${message ? `<tr>
                <td style="padding: 10px 0; color: #666; font-size: 13px; vertical-align: top;">Message</td>
                <td style="padding: 10px 0; color: #ccc; font-size: 13px; font-style: italic;">${message}</td>
              </tr>` : ""}
            </table>

            <a href="https://gowildroute.com/admin" style="display: inline-block; background: #1D9E75; color: #fff; padding: 12px 28px; border-radius: 8px; font-size: 14px; font-weight: 600; text-decoration: none; margin-bottom: 20px;">
              Open Admin → Forward Lead
            </a>

            <p style="color: #444; font-size: 12px; margin: 0;">Lead ID: ${lead?.id || "—"} · Do not share agency contact details directly with the customer.</p>
          </div>
        </div>
      `,
    });

    // 3. Confirmation email to user
    await resend.emails.send({
      from: "WildRoute <team@gowildroute.com>",
      to: [email],
      subject: `✅ Your enquiry is received — ${trekTitle || agencyName || "WildRoute"}`,
      html: `
        <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; background: #0a0a0a; color: #fff; border-radius: 16px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #0F2A1E, #0a0a0a); padding: 32px; border-bottom: 1px solid #1a1a1a; text-align: center;">
            <h1 style="font-size: 22px; font-weight: 800; margin: 0 0 4px;">Wild<span style="color: #1D9E75;">Route</span></h1>
            <p style="color: #555; font-size: 12px; margin: 0; letter-spacing: 0.1em; text-transform: uppercase;">India's Adventure Platform</p>
          </div>
          <div style="padding: 32px;">
            <h2 style="color: #fff; font-size: 20px; margin: 0 0 12px;">Hi ${name} 👋</h2>
            <p style="color: #888; font-size: 14px; line-height: 1.7; margin: 0 0 24px;">
              We've received your enquiry${trekTitle ? ` for <strong style="color:#fff;">${trekTitle}</strong>` : ""}. Our team will review it and connect you with the right agency within <strong style="color:#1D9E75;">24 hours</strong>.
            </p>
            <div style="background: #111; border: 1px solid #1a1a1a; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
              <p style="color: #666; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; margin: 0 0 12px;">YOUR ENQUIRY SUMMARY</p>
              ${trekTitle ? `<p style="color: #ccc; font-size: 13px; margin: 0 0 6px;">🥾 <strong style="color:#fff;">${trekTitle}</strong></p>` : ""}
              <p style="color: #ccc; font-size: 13px; margin: 0 0 6px;">👥 Group: ${groupSize || 1} person(s)</p>
              ${message ? `<p style="color: #ccc; font-size: 13px; margin: 0; font-style: italic;">"${message}"</p>` : ""}
            </div>
            <p style="color: #555; font-size: 12px; margin: 0; text-align: center;">
              Questions? Reply to this email or visit <a href="https://gowildroute.com" style="color:#1D9E75;">gowildroute.com</a>
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Enquiry error:", e);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
