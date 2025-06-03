export const getCollegeHoursRange = () => {
  const start = new Date();
  start.setHours(10, 0, 0, 0); // Today at 10:00:00 AM

  const end = new Date();
  end.setHours(17, 0, 0, 0); // Today at 5:00:00 PM

  return { start, end };
};
