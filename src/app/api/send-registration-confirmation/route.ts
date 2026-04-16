import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email, agencyName, registrationId, trekName } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const name = agencyName || "there";

    const { data, error } = await resend.emails.send({
      from: "WildRoute <onboarding@wildroute.in>",
      to: [email],
      subject: `🎉 Welcome to WildRoute — Registration Confirmed!`,
      html: `
        <div style="font-family: sans-serif; max-width: 580px; margin: 0 auto; padding: 0; background: #0a0a0a; color: #fff; border-radius: 16px; overflow: hidden;">

          <!-- Header Banner -->
          <div style="background: linear-gradient(135deg, #0F2A1E 0%, #0a0a0a 100%); padding: 40px 32px 32px; text-align: center; border-bottom: 1px solid #1a1a1a;">
            <h1 style="font-size: 26px; font-weight: 800; margin: 0 0 6px 0; letter-spacing: -0.5px;">
              Wild<span style="color: #1D9E75;">Route</span>
            </h1>
            <p style="color: #555; font-size: 12px; margin: 0; letter-spacing: 0.1em; text-transform: uppercase;">India's Adventure Platform</p>
          </div>

          <!-- Success Icon -->
          <div style="text-align: center; padding: 36px 32px 8px;">
            <div style="width: 64px; height: 64px; background: #0F2A1E; border: 2px solid #1D9E75; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 28px; margin-bottom: 20px;">
              ✓
            </div>
            <h2 style="color: #fff; font-size: 22px; font-weight: 700; margin: 0 0 8px 0;">You're officially registered!</h2>
            <p style="color: #888; font-size: 15px; margin: 0; line-height: 1.6;">
              Welcome to WildRoute, <strong style="color: #fff;">${name}</strong>. Your agency listing is now under review.
            </p>
          </div>

          <!-- Info Card -->
          <div style="margin: 28px 32px; background: #111; border: 1px solid #1a1a1a; border-radius: 12px; padding: 24px;">
            <p style="color: #555; font-size: 11px; font-weight: 600; letter-spacing: 0.1em; margin: 0 0 16px 0; text-transform: uppercase;">Registration Details</p>

            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="color: #666; font-size: 13px; padding: 8px 0; border-bottom: 1px solid #1a1a1a; width: 40%;">Agency</td>
                <td style="color: #fff; font-size: 13px; font-weight: 600; padding: 8px 0; border-bottom: 1px solid #1a1a1a;">${name}</td>
              </tr>
              ${trekName ? `
              <tr>
                <td style="color: #666; font-size: 13px; padding: 8px 0; border-bottom: 1px solid #1a1a1a;">First Trek Listed</td>
                <td style="color: #1D9E75; font-size: 13px; font-weight: 600; padding: 8px 0; border-bottom: 1px solid #1a1a1a;">${trekName}</td>
              </tr>` : ""}
              <tr>
                <td style="color: #666; font-size: 13px; padding: 8px 0; border-bottom: 1px solid #1a1a1a;">Registration ID</td>
                <td style="color: #1D9E75; font-size: 13px; font-weight: 600; padding: 8px 0; border-bottom: 1px solid #1a1a1a;">${registrationId || "—"}</td>
              </tr>
              <tr>
                <td style="color: #666; font-size: 13px; padding: 8px 0;">Status</td>
                <td style="padding: 8px 0;">
                  <span style="background: rgba(245,158,11,0.15); color: #F59E0B; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 20px; border: 1px solid rgba(245,158,11,0.3);">Under Review</span>
                </td>
              </tr>
            </table>
          </div>

          <!-- What's Next -->
          <div style="margin: 0 32px 28px; background: #0d0d0d; border: 1px solid #1a1a1a; border-radius: 12px; padding: 24px;">
            <p style="color: #555; font-size: 11px; font-weight: 600; letter-spacing: 0.1em; margin: 0 0 16px 0; text-transform: uppercase;">What happens next?</p>

            <div style="display: flex; flex-direction: column; gap: 12px;">
              <div style="display: flex; gap: 14px; align-items: flex-start;">
                <div style="min-width: 28px; height: 28px; background: #1D9E75; border-radius: 50%; text-align: center; line-height: 28px; font-size: 12px; font-weight: 700; color: #fff;">1</div>
                <div>
                  <p style="color: #ccc; font-size: 13px; font-weight: 600; margin: 0 0 2px 0;">Verification (24–48 hrs)</p>
                  <p style="color: #555; font-size: 12px; margin: 0;">Our team reviews your agency details, PAN, and trek listing.</p>
                </div>
              </div>
              <div style="display: flex; gap: 14px; align-items: flex-start;">
                <div style="min-width: 28px; height: 28px; background: #1D9E75; border-radius: 50%; text-align: center; line-height: 28px; font-size: 12px; font-weight: 700; color: #fff;">2</div>
                <div>
                  <p style="color: #ccc; font-size: 13px; font-weight: 600; margin: 0 0 2px 0;">Go Live</p>
                  <p style="color: #555; font-size: 12px; margin: 0;">Once verified, your agency page and treks go live on wildroute.in.</p>
                </div>
              </div>
              <div style="display: flex; gap: 14px; align-items: flex-start;">
                <div style="min-width: 28px; height: 28px; background: #1D9E75; border-radius: 50%; text-align: center; line-height: 28px; font-size: 12px; font-weight: 700; color: #fff;">3</div>
                <div>
                  <p style="color: #ccc; font-size: 13px; font-weight: 600; margin: 0 0 2px 0;">Start receiving enquiries</p>
                  <p style="color: #555; font-size: 12px; margin: 0;">Adventure seekers can discover and enquire about your treks.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- CTA -->
          <div style="text-align: center; padding: 0 32px 36px;">
            <a href="https://wildroute.in/explore" style="background: #1D9E75; color: #fff; padding: 14px 36px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600; display: inline-block;">
              Explore WildRoute →
            </a>
            <p style="color: #444; font-size: 12px; margin: 16px 0 0 0;">
              Questions? Email us at <a href="mailto:support@wildroute.in" style="color: #1D9E75; text-decoration: none;">support@wildroute.in</a>
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #0d0d0d; border-top: 1px solid #1a1a1a; padding: 20px 32px; text-align: center;">
            <p style="color: #333; font-size: 11px; margin: 0; line-height: 1.6;">
              WildRoute — India's Adventure Platform<br />
              You're receiving this because you registered your agency on <a href="https://wildroute.in" style="color: #444; text-decoration: none;">wildroute.in</a>
            </p>
          </div>

        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to send email" },
      { status: 500 }
    );
  }
}
