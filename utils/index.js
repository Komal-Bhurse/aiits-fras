import dotenv from 'dotenv'
import crypto from "crypto";

const envFile =
  process.env.NODE_ENV === 'prod'
    ? '.env.prod'
    : '.env.dev';

dotenv.config({ path: envFile });


const TIMEZONE = process.env.TIMEZONE;


export const getHoursRange = () => {
  const start = new Date();
  start.setHours(10, 0, 0, 0); // Today at 10:00:00 AM

  const end = new Date();
  end.setHours(24, 0, 0, 0); // Today at 5:00:00 PM

  return { start, end };
};

export function getUTCToISTTime(dateInput) {
const date = new Date(dateInput);

  return date.toLocaleTimeString('en-IN', {
    timeZone: TIMEZONE,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function maskAadhaar(aadhaar) {
  return "****"+" "+"****"+" "+aadhaar.slice(8);
}


const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // 32 bytes key
const IV = crypto.randomBytes(16); // Initialization vector

export function encryptAadhaar(aadhaar) {
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), IV);
  let encrypted = cipher.update(aadhaar, "utf8", "hex");
  encrypted += cipher.final("hex");
  return { encryptedData: encrypted, iv: IV.toString("hex") };
}

export function decryptAadhaar(encryptedData, iv) {
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), Buffer.from(iv, "hex"));
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}



