/**
 * File Download Utilities
 * Handles client-side file downloads via blob URLs
 */

/**
 * Downloads a file to the user's device
 * @param content - The file content as a string
 * @param filename - The desired filename (including extension)
 * @param mimeType - The MIME type of the file
 */
export function downloadFile(
  content: string,
  filename: string,
  mimeType: string
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;

  // Append to body, click, and cleanup
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the blob URL
  URL.revokeObjectURL(url);
}

/**
 * Downloads a JSON object as a formatted JSON file
 * @param data - The data to serialize as JSON
 * @param filename - The desired filename (without extension)
 */
export function downloadJSON(data: unknown, filename: string): void {
  const content = JSON.stringify(data, null, 2);
  downloadFile(content, `${filename}.json`, "application/json");
}

/**
 * Downloads plain text content
 * @param content - The text content to download
 * @param filename - The desired filename (without extension)
 */
export function downloadText(content: string, filename: string): void {
  downloadFile(content, `${filename}.txt`, "text/plain");
}
