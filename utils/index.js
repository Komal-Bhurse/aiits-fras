import dotenv from 'dotenv'
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
  end.setHours(12, 53, 0, 0); // Today at 5:00:00 PM

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


