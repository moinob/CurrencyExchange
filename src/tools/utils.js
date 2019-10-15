export const isToday = day => {
  if (!day) return false;
  const today = new Date().setHours(0, 0, 0, 0);
  const compareTo = new Date(day).setHours(0, 0, 0, 0);
  return today.valueOf() === compareTo.valueOf();
};