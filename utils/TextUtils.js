export const truncateString = (string, maxLength) => {
  // leave room for "..."
  const maxChars = maxLength - 3;

  return string.length > maxChars
    ? string.substring(0, maxChars) + "..."
    : string;
};
