export const getCollegeHoursRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0); // Today at 10:00:00 AM

  const end = new Date();
  end.setHours(23, 59, 59, 999); // Today at 5:00:00 PM

  return { start, end };
};
