export function formatDateAndTime(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const dayOfTheMonth = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${dayOfTheMonth <= 9 ? `0${dayOfTheMonth}` : dayOfTheMonth}/${
    month <= 9 ? `0${month}` : month
  }/${year} at ${hours <= 9 ? `0${hours}` : hours}:${
    minutes <= 9 ? `0${minutes}` : minutes
  }`;
}
