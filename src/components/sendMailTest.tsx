"use client";

import { useState } from "react";

export default function SendMailTest() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Request failed");

      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto space-y-4 border rounded-lg p-4"
    >
      <input
        name="name"
        placeholder="ชื่อของคุณ (ไม่บังคับ)"
        value={form.name}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
      />

      <input
        name="email"
        type="email"
        required
        placeholder="อีเมลของคุณ"
        value={form.email}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
      />

      <textarea
        name="message"
        required
        placeholder="ข้อความของคุณ"
        value={form.message}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2 h-28"
      />

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-blue-600 text-white rounded py-2 disabled:opacity-50"
      >
        {status === "loading" ? "กำลังส่ง..." : "ส่งข้อความ"}
      </button>

      {status === "success" && (
        <p className="text-green-600 text-sm">ส่งข้อความสำเร็จแล้ว 🎉</p>
      )}
      {status === "error" && (
        <p className="text-red-600 text-sm">
          ส่งไม่สำเร็จ ลองใหม่อีกครั้งนะครับ/คะ
        </p>
      )}
    </form>
  );
}
