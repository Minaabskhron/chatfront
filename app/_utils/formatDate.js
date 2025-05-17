export const formatDate = (isoDate) => {
  if (!isoDate) return "";
  const date = new Date(isoDate);

  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const normalDate = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

  const normalTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isToday) return normalTime || "";
  else return normalDate || "";
};

export const formatTime = (isoDate) => {
  const date = new Date(isoDate);

  const normalTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return normalTime;
};
