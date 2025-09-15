/**
 * Truncates text to a specified maximum length with ellipsis
 * @param text - The text to truncate
 * @param maxLength - Maximum number of characters (default: 150)
 * @returns Truncated text with ellipsis if needed
 */
export const truncateText = (text: string, maxLength: number = 150): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
};