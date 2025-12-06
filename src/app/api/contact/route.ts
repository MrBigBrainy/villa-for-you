// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend("re_Y8UGnT7r_tTh58aGzb65fzYFACfKxwYLZ");

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!email || !message) {
      return NextResponse.json(
        { error: "Email and message are required" },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to: process.env.TO_EMAIL!,
      subject: `New contact form from ${name || "Unknown"}`,
      replyTo: email, // so you can reply directly
      text: `
New message from your website:

Name: ${name || "-"}
Email: ${email}

Message:
${message}
      `.trim(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Resend error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
