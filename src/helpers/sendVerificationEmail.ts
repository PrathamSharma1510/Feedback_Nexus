import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<{ success: boolean; message: string; error?: any }> {
  try {
    await resend.emails.send({
      from: "admin@orioleentertainment.com",
      to: email,
      subject: "MessageMystry | Verification Email",
      react: VerificationEmail({
        username,
        otp: verifyCode,
      }),
      text: "hello world",
    });

    return {
      success: true,
      message: `Email Sent Success ${email}`,
    };
  } catch (emailerror) {
    return {
      success: false,
      message: "Verification email failed",
      error: emailerror,
    };
  }
}
