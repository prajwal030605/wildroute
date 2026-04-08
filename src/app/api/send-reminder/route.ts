import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email, agencyName, registrationId, onboardingStep } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const name = agencyName || "there";
    const step = Number(onboardingStep) || 0;

    let missingSteps = "";
    if (step === 0) {
      missingSteps = "agency details, trek information, and pricing";
    } else if (step === 1) {
      missingSteps = "trek information and pricing";
    } else if (step === 2) {
      missingSteps = "pricing and logistics";
    }

    const { data, error } = await resend.emails.send({
      from: "WildRoute <onboarding@wildroute.in>",
      to: [email],
      subject: `Complete your WildRoute registration — ${registrationId || ""}`,
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background: #0a0a0a; color: #fff;">
          <div style="text-align: center; margin-bottom: 28px;">
            <h1 style="font-size: 22px; font-weight: 700; margin: 0;">
              Wild<span style="color: #1D9E75;">Route</span>
            </h1>
          </div>

          <p style="color: #ccc; font-size: 15px; line-height: 1.7;">
            Hi <strong>${name}</strong>,
          </p>

          <p style="color: #aaa; font-size: 14px; line-height: 1.7;">
            We noticed your agency registration on WildRoute is incomplete. You still need to fill in your <strong style="color: #fff;">${missingSteps}</strong>.
          </p>

          <p style="color: #aaa; font-size: 14px; line-height: 1.7;">
            Completing your registration takes just a few minutes and will get your agency listed in front of thousands of adventure seekers across India.
          </p>

          ${registrationId ? `<p style="color: #555; font-size: 12px;">Registration ID: <strong style="color: #888;">${registrationId}</strong></p>` : ""}

          <div style="text-align: center; margin: 32px 0;">
            <a href="https://wildroute.in/register/agency/onboarding" style="background: #1D9E75; color: #fff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">
              Complete Registration →
            </a>
          </div>

          <p style="color: #555; font-size: 13px; line-height: 1.7;">
            If you need help, just reply to this email or contact us at <a href="mailto:support@wildroute.in" style="color: #1D9E75;">support@wildroute.in</a>.
          </p>

          <hr style="border: none; border-top: 1px solid #1a1a1a; margin: 28px 0;" />

          <p style="color: #333; font-size: 11px; text-align: center;">
            WildRoute — India's Adventure Platform<br />
            You're receiving this because you started registering on wildroute.in
          </p>
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
