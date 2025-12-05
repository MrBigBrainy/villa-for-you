import { EmailTemplate } from "../../../components/email/email-template";
import { EmailTemplate2 } from "@/components/email/email-template2";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

import { residences } from "../../../data/residences";
import { db } from "@/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, residenceId, date, time, message } = body;

    const residence = residences.find(r => r.id === residenceId);
    const residenceName = residence ? residence.name : residenceId;

    let webName = "Villa";
    let adminEmail = "onboarding@resend.dev"; // Default fallback

    try {
      const settingsRef = doc(db, "setting", "main");
      const settingsSnap = await getDoc(settingsRef);
      if (settingsSnap.exists()) {
        const data = settingsSnap.data();
        webName = data.webName || "Villa";
        if (data.email) {
          adminEmail = data.email;
        }
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }

    const result = await resend.emails.send({
      from: `${webName} <onboarding@resend.dev>`,
      to: [adminEmail],
      subject: `New Reservation Request from ${name}`,
      html: `
        <h2>New Reservation Request</h2>
        <p><strong>Residence:</strong> ${residenceName}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Message:</strong></p>
        <p>${message || "-"}</p>
      `,
    });

    if (result.error) {
      return Response.json({ result }, { status: 500 });
    }

    return Response.json(result.data);
  } catch (error) {
    console.log(error)
    return Response.json({ error }, { status: 500 });
  }
}
