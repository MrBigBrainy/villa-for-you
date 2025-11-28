'use server';

export async function validateRegistrationKey(key: string) {
  // In a real app, this should be an environment variable like process.env.REGISTRATION_SECRET
  // For this task, we hardcode "pik" as requested.
  const SECRET_KEY = "pik";
  
  if (key === SECRET_KEY) {
    return { success: true };
  } else {
    return { success: false, error: "Invalid secret key" };
  }
}
