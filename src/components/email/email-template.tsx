import * as React from "react";

interface EmailTemplateProps {
  name: string;
  email: string;
  residenceName: string;
  date: string;
  time: string;
  message: string;
}

export function EmailTemplate({
  name,
  email,
  residenceName,
  date,
  time,
  message,
}: EmailTemplateProps) {
  return (
    <div>
      <h1>New Reservation Request from {name}</h1>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>Residence:</strong> {residenceName}</p>
      <p><strong>Date:</strong> {date}</p>
      <p><strong>Time:</strong> {time}</p>
      <p><strong>Message:</strong></p>
      <p>{message}</p>
    </div>
  );
}
