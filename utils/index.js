export const getHoursRange = () => {
  const start = new Date();
  start.setHours(10, 0, 0, 0); // Today at 10:00:00 AM

  const end = new Date();
  end.setHours(11, 45, 0, 0); // Today at 5:00:00 PM

  return { start, end };
};

export function getUTCToISTTime(utcString) {
const date = new Date(utcDateInput); // Accepts UTC string, timestamp, or Date object

  return date.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata', // Force IST timezone
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}


